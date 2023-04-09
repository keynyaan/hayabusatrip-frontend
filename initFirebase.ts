import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebaseの認証情報を設定
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Firebaseの初期化＆Appオブジェクトの作成
const getFirebaseApp = () => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig)
  } else {
    return getApp()
  }
}

const app = getFirebaseApp()

// FirebaseAppに関連するAuthインスタンスを取得
export const auth = getAuth(app)
