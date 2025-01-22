document.addEventListener('DOMContentLoaded', function () {
    const bookList = document.getElementById('book-list');
    const sortOrderSelect = document.getElementById('sort-order');
    const sortOrderDateSelect = document.getElementById('sort-order-date');
    const searchInput = document.getElementById('search-input'); // 検索バー
    const modal = document.getElementById('review-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeModal = document.querySelector('#review-modal .close');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const deleteConfirmYes = document.getElementById('delete-confirm-yes');
    const deleteConfirmNo = document.getElementById('delete-confirm-no');
    const paginationList = document.getElementById('pagination-list');
    const prevLink = document.querySelector('#pagination-list .prev');
    const nextLink = document.querySelector('#pagination-list .next');
    const loadingScreen = document.getElementById('loading-screen'); // ローディング画面

    let savedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const booksPerPage = 5; // 1ページに表示するアイテムの数
    let currentPage = 1;
    let totalPages = 1;

    let selectedIndex = null; // クリックされた本のインデックスを保持する変数

    function renderBookList() {
        const sortOrder = sortOrderSelect.value;
        const sortOrderDate = sortOrderDateSelect.value;
        const searchKeyword = searchInput.value.trim().toLowerCase(); // 検索キーワード取得
        let filteredBooks = savedBooks;

        // 検索キーワードに一致する本をフィルタリング
        if (searchKeyword) {
            filteredBooks = savedBooks.filter(book =>
                book.title.toLowerCase().includes(searchKeyword) ||
                book.author.toLowerCase().includes(searchKeyword)
            );
        }

        let sortedBooks = sortBooksByDate(filteredBooks, sortOrderDate);
        if (sortOrder === 'asc') {
            sortedBooks.sort((a, b) => b.rating - a.rating); // 評価が高い順
        } else {
            sortedBooks.sort((a, b) => a.rating - b.rating); // 評価が低い順
        }

        const paginatedBooks = paginateBooks(sortedBooks, currentPage, booksPerPage);
        bookList.innerHTML = '';
        paginatedBooks.forEach((book, i) => addBookToList(book, i, sortedBooks));
        attachReviewDetailEvents(sortedBooks);
        renderPagination(filteredBooks.length);
    }

    // 読書日でソートする関数
    function sortBooksByDate(books, order) {
        return books.slice().sort((a, b) => {
            const dateA = new Date(a.readDate);
            const dateB = new Date(b.readDate);
            return order === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }

    // ページネーション
    function paginateBooks(books, page, perPage) {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        return books.slice(startIndex, endIndex);
    }

    function renderPagination(totalBooks) {
        paginationList.innerHTML = '';
        totalPages = Math.ceil(totalBooks / booksPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
            paginationList.appendChild(li);
        }

        document.querySelectorAll('#pagination-list a').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                currentPage = parseInt(link.getAttribute('data-page'));
                renderBookList();
            });
        });
    }

    function addBookToList(book, globalIndex, sortedBooks) {
        const li = document.createElement('li');
        const truncatedReview = book.review.length > 20 ? `${book.review.substring(0, 20)}...` : book.review;
    
        li.innerHTML = `
            <div class="book-item">
                <!-- 縦長の画像 -->
                <div class="image-container">
                    <img src="${book.image || 'placeholder.jpg'}" alt="Book Image" class="book-image">
                </div>
    
                <!-- 本の情報 -->
                <div class="book-details">
                    <h3 class="book-title"> ${book.title}</h3>
                    <p>${book.author}</p>
                    <p>${book.readDate}</p>
                    <p class="rating-stars">${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</p>
                    <p class="review-preview">${truncatedReview}</p>
                </div>
            </div>
            <button class="delete-button" data-index="${globalIndex}">✕</button>
        `;
        bookList.appendChild(li);
    }
    
    
    
    
    

    function attachReviewDetailEvents(sortedBooks) {
        const reviewDetailButtons = document.querySelectorAll('.review-detail-button');
        reviewDetailButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(button.getAttribute('data-index'), 10);
                showModal(index, sortedBooks);
            });
        });
    }

    function showModal(index, sortedBooks) {
        const book = sortedBooks[index];
        if (!book) {
            console.error('Invalid index or book not found:', index);
            return;
        }
        // 各入力データを取得
        const title = book.title;
        const author = book.author;
        const readDate = book.readDate;
        const rating = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating); // 評価を★で表示
        const review = book.review.replace(/\n/g, '<br>'); // 改行を <br> に変換
    
        // モーダル内のHTMLを更新（左揃えで表示）
        modalDetails.innerHTML = `
            <h3>タイトル: ${title}</h3>
            <p><strong>著者:</strong> ${author}</p>
            <p><strong>読書日:</strong> ${readDate}</p>
            <p><strong>評価:</strong> ${rating}</p>
            <p><strong>レビュー:</strong></p>
            <p>${review}</p>
        `;
        modal.style.display = 'block'; // モーダルを表示
    }
    
    

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    function deleteBook(index) {
        if (index === null) return; // インデックスが無効なら処理しない
        savedBooks.splice(index, 1); // インデックスを使って削除
        localStorage.setItem('books', JSON.stringify(savedBooks)); // 更新されたリストをローカルストレージに保存
        renderBookList(); // リストを再描画
    }

    bookList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            // 削除する本のインデックスを保存
            selectedIndex = event.target.getAttribute('data-index');
            showDeleteConfirmModal(selectedIndex); // モーダルを表示
        }
    });

  // モーダルを表示する関数
function showDeleteConfirmModal() {
    deleteConfirmModal.classList.add('show');
}

// モーダルを非表示にする関数
function hideDeleteConfirmModal() {
    deleteConfirmModal.classList.remove('show');
}

// 初期状態でモーダルを非表示に設定
deleteConfirmModal.classList.remove('show');

// 「はい」ボタンで削除処理を実行し、モーダルを閉じる
deleteConfirmYes.addEventListener('click', function () {
    deleteBook(selectedIndex); // 選択された本を削除
    hideDeleteConfirmModal(); // モーダルを閉じる
});

// 「いいえ」ボタンでモーダルを閉じる処理
deleteConfirmNo.addEventListener('click', hideDeleteConfirmModal);

// 「×」ボタンでレビュー詳細モーダルを閉じる
closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
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

    sortOrderSelect.addEventListener('change', renderBookList);
    sortOrderDateSelect.addEventListener('change', renderBookList);
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            currentPage = 1;
            renderBookList();
        }
    });

    renderBookList();
    renderPagination(savedBooks.length);
});
