document.addEventListener('DOMContentLoaded', function () {
    const loadingScreen = document.getElementById('loading-screen'); // ローディング画面

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
        const notification = document.getElementById('notification');
        notification.textContent = '本が追加されました';
        notification.classList.add('show');

        // 3秒後に通知を非表示にする
        setTimeout(function () {
            notification.classList.remove('show');
        }, 1000);
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
            }, 1000);
        });
    });

    window.addEventListener('load', function () {
        loadingScreen.classList.remove('active');
    });
});
