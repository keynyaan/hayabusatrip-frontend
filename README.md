こちらは「HayabusaTrip」のフロントエンドのリポジトリになります。バックエンドのリポジトリは[こちら](https://github.com/keynyaan/hayabusatrip-backend)です。

# HayabusaTrip / 旅行プラン共有サービス

![service-image](https://raw.githubusercontent.com/keynyaan/hayabusatrip-frontend/main/public/images/ogp.png)
[![CI/CD](https://github.com/keynyaan/hayabusatrip-frontend/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/keynyaan/hayabusatrip-frontend/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/keynyaan/hayabusatrip-frontend/graph/badge.svg?token=LCPY7L2MHO)](https://codecov.io/gh/keynyaan/hayabusatrip-frontend)
[![Ruby](https://img.shields.io/badge/Ruby-v3.2.2-CC342D?logo=Ruby&logoColor=CC342D)](https://www.ruby-lang.org/ja/news/2023/03/30/ruby-3-2-2-released)
[![Rails](https://img.shields.io/badge/Rails-v7.0.7.2-CC0000?logo=Ruby-on-Rails&logoColor=CC0000)](https://rubyonrails.org/2023/3/13/Rails-7-0-4-3-and-6-1-7-3-have-been-released)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0.2-007ACC?logo=TypeScript&logoColor=007ACC)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)
[![React](https://img.shields.io/badge/React-v18.2.0-61DAFB?logo=React&logoColor=61DAFB)](https://react.dev/blog/2022/03/29/react-v18#whats-new-in-react-18)
[![Next.js](https://img.shields.io/badge/Next.js-v13.2.4-000000?logo=Next.js&logoColor=000000)](https://nextjs.org/blog/next-13-2)
[![AWS](https://img.shields.io/badge/Amazon%20AWS-gray?logo=Amazon-AWS&logoColor=FFFFFF)](https://aws.amazon.com)
[![Docker](https://img.shields.io/badge/Docker-gray?logo=Docker&logoColor=2496ED)](https://www.docker.com)
[![Firebase](https://img.shields.io/badge/Firebase-gray?logo=Firebase&logoColor=FFCA28)](https://firebase.google.com)
[![Thanks](https://img.shields.io/badge/Thank%20you-for%20visiting-00aab9)](https://www.hayabusatrip.com)

## サービス概要

HayabusaTripは、「旅の準備をもっとシンプルにしたい！」という想いから作られた、無料の旅行プラン共有サービスです。

わずか3ステップで旅行プランを共有できる直感的なUIで、ユーザーの面倒な旅行の準備をサポートします。

### ▼ サービスURL

https://www.hayabusatrip.com

レスポンシブ対応済のため、PCでもスマートフォンでも快適にご利用いただけます。

### ▼ 紹介記事(Qiita)

<!-- あとで書く -->

サービスのリリースまでに、勉強したことなどを解説しています。

### ▼ 開発者Twitter

https://twitter.com/keynyaan

何かあれば、こちらまでお気軽にご連絡ください。

## メイン機能の使い方

<table>
  <tr>
     <th style="text-align: center">旅行プラン作成</th>
    <th style="text-align: center">旅行スポット追加</th>
    <th style="text-align: center">旅行プラン公開</th>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/keynyaan/hayabusatrip-frontend/main/public/images/demo/create-trip.gif" alt="旅行プラン作成" />まずは、旅行プラン作成ボタンを押して、各旅行情報を記入後に作成ボタンを押す。</td>
    <td><img src="https://raw.githubusercontent.com/keynyaan/hayabusatrip-frontend/main/public/images/demo/add-spot.gif" alt="旅行スポット追加" />次に、スポット追加ボタンを押して、各スポット情報を記入後に追加ボタンを押す。</td>
    <td><img src="https://raw.githubusercontent.com/keynyaan/hayabusatrip-frontend/main/public/images/demo/publish-settings.gif" alt="旅行プラン公開" />最後に、三点リーダーから公開状態の変更ボタンを押して、公開に変更したら完了！</td>
  </tr>
</table>

## 使用技術一覧

**バックエンド:** Ruby 3.2.2 / Rails 7.0.7.2

- コード解析 / フォーマッター: Rubocop
- テストフレームワーク: RSpec

**フロントエンド:** TypeScript 5.0.2 / React 18.2.0 / Next.js 13.2.4

- コード解析: ESLint
- フォーマッター: Prettier
- テストフレームワーク: Jest / React Testing Library
- CSSフレームワーク: Tailwind CSS
- 主要パッケージ: Axios / Font Awesome / React Paginate / React Responsive Modal / React Toastify

**インフラ:** AWS(Route53 / Certificate Manager / ALB / VPC / ECR / ECS Fargate / RDS MySQL / S3) / Nginx / Vercel

**CI / CD:** GitHub Actions

**環境構築:** Docker / Docker Compose

**認証:** Firebase Authentication

## 主要対応一覧

### ユーザー向け

#### 機能

- メールアドレスとパスワードを利用したユーザー登録 / ログイン機能
- Googleアカウントを利用したユーザー登録 / ログイン機能
- ユーザー情報変更機能
- パスワード再設定機能
- 退会機能
- 旅行プランの取得 / 作成 / 更新 / 削除機能
- 旅行プランの検索機能
- 旅行プランの公開 / 非公開機能
- 旅行スポットの取得 / 作成 / 更新 / 削除機能
- Twitterシェア機能
- ページネーション機能
- 画像の取得 / アップロード機能

#### 画面

- トースト表示
- ローディング画面
- モーダル画面(各画面の詳細は[下記](#screen-transition-diagram)の画面遷移図参照)
- 404 / 500エラーのカスタム画面
- レスポンシブデザイン

### 非ユーザー向け

#### システム / インフラ

- Next.jsのImage / Linkコンポーネントなどの活用によるサービス全体の高速化
- Dockerによる開発環境のコンテナ化
- Route53による独自ドメイン + SSL化
- GitHub ActionsによるCI / CDパイプラインの構築
  - バックエンド
    - CI: Rubocop / RSpec
    - CD: AWS ECS
  - フロントエンド
    - CI: ESLint / Prettier / Jest / Codecov
    - CD: Vercel

#### テスト / セキュリティ

- クロスブラウザテスト

  - PC
    - Windows10 / 11: Google Chrome / Firefox / Microsoft Edge
    - Mac: Google Chrome / Firefox / Safari
  - スマートフォン
    - Android: Google Chrome
    - iOS: Safari

- Codecovによるコードカバレッジの分析と可視化
- 脆弱性対応(Dependabot Alerts / Code Scanning Alerts / GitGuardian)

## インフラ構成図

![infrastructure-diagram](https://raw.githubusercontent.com/keynyaan/hayabusatrip-frontend/main/public/images/diagrams/infrastructure-diagram.png)

## ER図

![er-diagram](https://raw.githubusercontent.com/keynyaan/hayabusatrip-frontend/main/public/images/diagrams/er-diagram.png)

<a id="screen-transition-diagram"></a>

## 画面遷移図

[Figma\_画面遷移図](https://www.figma.com/file/1OgxVeGaDw9riHGzxyGoLG/%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB%E5%9B%B3_HayabusaTrip?type=design&node-id=0-1&mode=design)
