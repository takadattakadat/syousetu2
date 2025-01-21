document.addEventListener('DOMContentLoaded', function () {
    const loadingScreen = document.getElementById('loading-screen'); // ローディング画面

    // 通知メッセージを表示
    function showNotification(message) {
        const notification = document.getElementById('notification');
        const overlay = document.getElementById('overlay');
        notification.innerHTML = message;  // メッセージを表示
        notification.classList.add('show');  // 通知を表示
        overlay.classList.add('show');  // オーバーレイを表示
    }

    // 通知メッセージを閉じる
    function closeNotification() {
        const notification = document.getElementById('notification');
        const overlay = document.getElementById('overlay');
        notification.classList.add('hide');  // 非表示にするアニメーションを開始
        overlay.classList.remove('show');  // オーバーレイを非表示にする

        // アニメーションが終わった後に完全に非表示にする
        setTimeout(function () {
            notification.classList.remove('show');  // 通知を非表示
            notification.classList.remove('hide');  // 非表示アニメーションをリセット
        }, 500); // 0.5秒後に非表示
    }

    // フォーム送信時の処理
    document.getElementById('book-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const rating = document.querySelector('input[name="rating"]:checked')?.value || '評価なし';
        const review = document.getElementById('review').value;
        const readDate = document.getElementById('read-date').value;

        const book = { title, author, rating, review, readDate };

        // ローカルストレージに保存
        const savedBooks = JSON.parse(localStorage.getItem('books')) || [];
        savedBooks.push(book);
        localStorage.setItem('books', JSON.stringify(savedBooks));

        // フォームをリセット
        document.getElementById('book-form').reset();

        // 通知メッセージの表示
        showNotification('本が正常に追加されました！');

        // 3秒後に通知を非表示にする
        setTimeout(function () {
            closeNotification();
        }, 2000); // 通知が2秒間表示されるように変更
    });

    // ページ遷移時にローディング画面を表示し、遷移を遅らせる
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            loadingScreen.classList.add('active');
            setTimeout(() => {
                window.location.href = href;
            }, 1000); // ローディング画面が1秒表示されるように設定
        });
    });

    // 画像プレビュー用のJavaScript
document.getElementById("image").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("image-preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result; // プレビュー画像を設定
        };
        reader.readAsDataURL(file); // ファイルを読み込む
    }
});


    window.addEventListener('load', function () {
        loadingScreen.classList.remove('active');
    });
});
