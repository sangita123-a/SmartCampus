import { ResultStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class ResultService {
  /**
   * Auto-computes letter grade and grade points based on percentage
   */
  public calculateGradeAndPoints(obtained: number, max: number, passing: number): { grade: string; gradePoint: number; status: ResultStatus } {
    if (obtained < passing) {
      return { grade: 'F', gradePoint: 0, status: ResultStatus.FAIL };
    }

    const percentage = (obtained / max) * 100;

    if (percentage >= 90) return { grade: 'O', gradePoint: 10, status: ResultStatus.PASS };
    if (percentage >= 80) return { grade: 'A+', gradePoint: 9, status: ResultStatus.PASS };
    if (percentage >= 70) return { grade: 'A', gradePoint: 8, status: ResultStatus.PASS };
    if (percentage >= 60) return { grade: 'B+', gradePoint: 7, status: ResultStatus.PASS };
    if (percentage >= 50) return { grade: 'B', gradePoint: 6, status: ResultStatus.PASS };
    if (percentage >= 40) return { grade: 'C', gradePoint: 5, status: ResultStatus.PASS };

    return { grade: 'F', gradePoint: 0, status: ResultStatus.FAIL };
  }

  async bulkSaveMarks(collegeId: string | null, payload: any) {
    const { examId, subjectId, marks } = payload;

    const examSubject = await prisma.examSubject.findUnique({
      where: {
        examId_subjectId: { examId, subjectId },
      },
      include: { exam: true },
    });

    if (!examSubject) {
      throw new AppError('Exam subject not found', 404);
    }

    if (collegeId && examSubject.exam.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    const maxMarks = Number(examSubject.maxMarks);
    const passingMarks = Number(examSubject.passingMarks);

    for (const m of marks) {
      if (m.obtainedMarks > maxMarks) {
        throw new AppError(`Obtained marks (${m.obtainedMarks}) cannot exceed maximum marks (${maxMarks})`, 400);
      }
    }

    // Process all entries in a transaction
    return prisma.$transaction(async (tx) => {
      let savedCount = 0;

      for (const m of marks) {
        let { grade, gradePoint, status } = this.calculateGradeAndPoints(m.obtainedMarks, maxMarks, passingMarks);

        if (m.resultStatus && m.resultStatus !== ResultStatus.PASS) {
          status = m.resultStatus as ResultStatus;
          if (status === ResultStatus.ABSENT || status === ResultStatus.FAIL) {
            grade = 'F';
            gradePoint = 0;
          }
        }

        await tx.studentResult.upsert({
          where: {
            studentId_examId_subjectId: {
              studentId: m.studentId,
              examId,
              subjectId,
            },
          },
          create: {
            studentId: m.studentId,
            examId,
            subjectId,
            obtainedMarks: m.obtainedMarks,
            grade,
            gradePoint,
            resultStatus: status,
            remarks: m.remarks || null,
          },
          update: {
            obtainedMarks: m.obtainedMarks,
            grade,
            gradePoint,
            resultStatus: status,
            remarks: m.remarks || null,
          },
        });
        savedCount++;
      }

      return {
        message: `Successfully saved marks for ${savedCount} students.`,
        savedCount,
      };
    });
  }

  async publishResults(examId: string, collegeId: string | null) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { examSubjects: true },
    });

    if (!exam) {
      throw new AppError('Exam not found', 404);
    }

    if (collegeId && exam.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    if (exam.examSubjects.length === 0) {
      throw new AppError('Cannot publish exam without subjects', 400);
    }

    return prisma.exam.update({
      where: { id: examId },
      data: { isPublished: true },
    });
  }

  async unpublishResults(examId: string, collegeId: string | null) {
    const exam = await prisma.exam.findUnique({ where: { id: examId } });

    if (!exam) {
      throw new AppError('Exam not found', 404);
    }

    if (collegeId && exam.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    return prisma.exam.update({
      where: { id: examId },
      data: { isPublished: false },
    });
  }

  async getStudentMarksheet(studentId: string, examId: string, collegeId: string | null) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { department: true, course: true, semester: true, college: true },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    if (collegeId && student.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examSubjects: {
          include: { subject: true },
        },
      },
    });

    if (!exam) {
      throw new AppError('Exam not found', 404);
    }

    const results = await prisma.studentResult.findMany({
      where: { studentId, examId },
      include: { subject: true },
    });

    let totalCredits = 0;
    let totalGradePointsWeighted = 0;
    let totalObtainedMarks = 0;
    let totalMaxMarks = 0;
    let overallStatus: ResultStatus = ResultStatus.PASS;

    const subjectBreakdown = exam.examSubjects.map((es) => {
      const res = results.find((r) => r.subjectId === es.subjectId);
      const credits = es.subject.credits || 3;
      const maxM = Number(es.maxMarks);

      if (res) {
        const obtainedM = Number(res.obtainedMarks);
        const gPoint = Number(res.gradePoint);

        totalObtainedMarks += obtainedM;
        totalMaxMarks += maxM;
        totalCredits += credits;
        totalGradePointsWeighted += gPoint * credits;

        if (res.resultStatus === ResultStatus.FAIL || res.resultStatus === ResultStatus.ABSENT) {
          overallStatus = ResultStatus.FAIL;
        }

        return {
          subjectCode: es.subject.subjectCode,
          subjectName: es.subject.subjectName,
          credits,
          maxMarks: maxM,
          passingMarks: Number(es.passingMarks),
          obtainedMarks: obtainedM,
          grade: res.grade,
          gradePoint: gPoint,
          resultStatus: res.resultStatus,
        };
      }

      totalMaxMarks += maxM;
      overallStatus = ResultStatus.FAIL;

      return {
        subjectCode: es.subject.subjectCode,
        subjectName: es.subject.subjectName,
        credits,
        maxMarks: maxM,
        passingMarks: Number(es.passingMarks),
        obtainedMarks: 0,
        grade: 'F',
        gradePoint: 0,
        resultStatus: ResultStatus.FAIL,
      };
    });

    const gpa = totalCredits > 0 ? (totalGradePointsWeighted / totalCredits).toFixed(2) : '0.00';

    // Calculate CGPA across all published exams for student
    const allResults = await prisma.studentResult.findMany({
      where: {
        studentId,
        exam: { isPublished: true },
      },
      include: { subject: true },
    });

    let cgpaTotalCredits = 0;
    let cgpaWeightedGP = 0;
    allResults.forEach((r) => {
      const cr = r.subject.credits || 3;
      cgpaTotalCredits += cr;
      cgpaWeightedGP += Number(r.gradePoint) * cr;
    });

    const cgpa = cgpaTotalCredits > 0 ? (cgpaWeightedGP / cgpaTotalCredits).toFixed(2) : gpa;

    return {
      student,
      exam,
      subjectBreakdown,
      summary: {
        totalObtainedMarks,
        totalMaxMarks,
        percentage: totalMaxMarks > 0 ? ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2) : '0.00',
        gpa: parseFloat(gpa),
        cgpa: parseFloat(cgpa),
        overallStatus,
      },
    };
  }

  async getRankList(examId: string, collegeId: string | null) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { course: true, semester: true, department: true },
    });

    if (!exam) {
      throw new AppError('Exam not found', 404);
    }

    if (collegeId && exam.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    const students = await prisma.student.findMany({
      where: {
        collegeId: exam.collegeId,
        departmentId: exam.departmentId,
        courseId: exam.courseId,
        semesterId: exam.semesterId,
        status: 'ACTIVE',
      },
    });

    const rankPromises = students.map(async (st) => {
      const ms = await this.getStudentMarksheet(st.id, examId, collegeId);
      return {
        studentId: st.id,
        rollNumber: st.rollNumber,
        studentName: `${st.firstName} ${st.lastName}`,
        totalObtained: ms.summary.totalObtainedMarks,
        totalMax: ms.summary.totalMaxMarks,
        percentage: ms.summary.percentage,
        gpa: ms.summary.gpa,
        overallStatus: ms.summary.overallStatus,
      };
    });

    const rankList = await Promise.all(rankPromises);

    // Sort by GPA desc, then totalObtained desc
    rankList.sort((a, b) => b.gpa - a.gpa || b.totalObtained - a.totalObtained);

    const rankedWithPosition = rankList.map((item, idx) => ({
      rank: idx + 1,
      ...item,
    }));

    return {
      exam,
      rankList: rankedWithPosition,
    };
  }
}

export const resultService = new ResultService();
