# 職業海報互動遊戲

這是一個可直接部署到 GitHub Pages 的靜態網站，用來在成果發表會展示職業海報並進行互動遊戲。

## 使用方式

1. 將整個資料夾上傳到 GitHub repository。
2. 到 repository 的 `Settings` -> `Pages`。
3. Source 選 `Deploy from a branch`，branch 選 `main`，資料夾選 `/root`。
4. 開啟 GitHub Pages 網址即可使用。

## 檔案結構

- `index.html`：網頁內容
- `styles.css`：版面與視覺樣式
- `app.js`：遊戲、海報展示、榜單互動
- `assets/posters/`：PDF 海報
- `assets/thumbs/`：海報縮圖

## 更新海報

新增 PDF 後，請放到 `assets/posters/`，再在 `app.js` 的 `posters` 陣列加入姓名、職業名稱、PDF 路徑與縮圖路徑。
