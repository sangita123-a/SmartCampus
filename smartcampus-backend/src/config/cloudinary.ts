import { v2 as cloudinary } from 'cloudinary';

import { env, isCloudinaryConfigured } from './env';

import { AppError } from '../utils/AppError';



if (isCloudinaryConfigured()) {

  cloudinary.config({

    cloud_name: env.CLOUDINARY_CLOUD_NAME,

    api_key: env.CLOUDINARY_API_KEY,

    api_secret: env.CLOUDINARY_API_SECRET,

    secure: true,

  });

}



export async function uploadImageBuffer(

  buffer: Buffer,

  folder = 'smartcampus/students'

): Promise<string> {

  if (!isCloudinaryConfigured()) {

    throw new AppError(

      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',

      503

    );

  }



  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(

      {

        folder,

        resource_type: 'image',

        transformation: [{ width: 800, height: 800, crop: 'limit' }],

      },

      (error, result) => {

        if (error || !result?.secure_url) {

          reject(new AppError('Failed to upload image to Cloudinary', 500));

          return;

        }

        resolve(result.secure_url);

      }

    );

    stream.end(buffer);

  });

}



export { cloudinary };

