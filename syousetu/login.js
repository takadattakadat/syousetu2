document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#login-form');
    const loadingScreen = document.getElementById('loading-screen'); // ローディング画面要素を取得

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // フォームのデフォルトの送信をキャンセル

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        // ローディング画面を表示
        loadingScreen.classList.add('active');

        // ログインのAPIリクエスト
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 1秒後にログイン成功した場合、ホーム画面に遷移
                setTimeout(() => {
                    window.location.href = href; // 明示的に遷移先URLを指定
                }, 1000); // 1秒の遅延
            } else {
                alert(data.message); // ログイン失敗メッセージ
                loadingScreen.classList.remove('active'); // ローディング画面を非表示
            }
        })
        .catch(error => {
            console.error('エラー:', error);
            alert('ログインに失敗しました');
            loadingScreen.classList.remove('active'); // ローディング画面を非表示
        });
    });
});
