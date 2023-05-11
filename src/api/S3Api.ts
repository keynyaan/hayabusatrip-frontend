import { UPLOAD_ERROR_MSG } from '@/utils/constants'
import AWS from 'aws-sdk'

AWS.config.region = process.env.NEXT_PUBLIC_AWS_REGION
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID as string,
})

export const uploadImageToS3 = async (file: File, filename: string) => {
  const s3 = new AWS.S3()

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
    Key: filename,
    Body: file,
    ContentType: file.type,
  }

  try {
    const result = await s3.upload(params).promise()
    return result.Location
  } catch (e) {
    throw new Error(UPLOAD_ERROR_MSG)
  }
}
