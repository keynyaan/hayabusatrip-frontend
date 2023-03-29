// テスト用のライブラリをインポート
import { render, screen } from '@testing-library/react';
// テストをしたいモジュールをインポート
import About from '@/pages/about';

// テストの説明
describe('About', () => {
  // テストケース
  it('Hello World!が表示されていること', () => {
    // About（about.tsx）を出力
    render(<About />);
    // screen.getByTextで文字列を検索し、toBeInTheDocument()で存在確認
    expect(screen.getByText('Hello World!')).toBeInTheDocument();
    // GitHub Actions のワークフロー動作確認 #7
    expect(screen.getByText('Hello GitHub Actions!')).toBeInTheDocument();
  });
});
