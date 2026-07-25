# Contributing to SmartCampus

Thank you for your interest in contributing to **SmartCampus**! We welcome contributions from developers, educational consultants, and open-source enthusiasts.

---

## Code of Conduct
Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions and code contributions.

---

## How to Contribute

### 1. Reporting Bugs
- Search existing GitHub Issues before opening a new bug report.
- Include OS version, browser, steps to reproduce, and environment details.

### 2. Requesting Features
- Open a feature request issue detailing the educational use-case and proposed implementation.

### 3. Pull Requests
1. Fork the repository and create a feature branch (`git checkout -b feature/amazing-feature`).
2. Follow TypeScript strict mode and formatting standards (`npm run lint`).
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`).
4. Push to your branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request against the `main` branch.

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/smartcampus.git
cd smartcampus

# Install backend dependencies
cd smartcampus-backend
npm install
npx prisma generate

# Install frontend dependencies
cd ../smartcampus-frontend
npm install

# Run backend
cd ../smartcampus-backend
npm run dev

# Run frontend
cd ../smartcampus-frontend
npm run dev
```
