const books = [];
const RENDER_EVENT = "render";

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKINVENTARY_APPS";

    
document.addEventListener("DOMContentLoaded", function () {
    	 
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
        });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
    const completedBOOKList = document.getElementById("completeBookshelfList");

    uncompletedBOOKList.innerHTML = "";
    completedBOOKList.innerHTML ="";
        	 
    
    for(bookItem of books){
        const bookElement = makeBook(bookItem);
        if(bookItem.isCompleted == false)
            uncompletedBOOKList.append(bookElement);
        else
            completedBOOKList.append(bookElement);
          }     
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
   
    let data = JSON.parse(serializedData);
   
    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }  
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
}
        	 
        	 
function generateBookObject(id, tittle, author, year, isCompleted) {
    return {
        id,
        tittle,
        author,
        year,
        isCompleted
        }
}

function addBook() {
    const textTitle = document.getElementById("inputBookTitle").value;
	const textAuthor = document.getElementById("inputBookAuthor").value;
	const textYear = document.getElementById("inputBookYear").value;
    const checklist = document.getElementById("inputBookIsComplete");
    
    const generatedID = generateId();
    if(checklist.checked==true){
        const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, true);
	    books.push(bookObject);
    }else{
        const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, false);
	    books.push(bookObject);
    } 
	document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeBook(bookObject) {

	const textTitle = document.createElement("h3");
	textTitle.innerText = bookObject.tittle;
	 
	const textAuthor = document.createElement("p");
	textAuthor.innerText = `Penulis : ${bookObject.author}`;
	   
    const textYear = document.createElement("p");
	textYear.innerText = `Tahun : ${bookObject.year}`;
	 
	const container = document.createElement("article");
	container.classList.add("book_item")
	container.append(textTitle, textAuthor, textYear);
	container.setAttribute("id", `book-${bookObject.id}`);

    if(bookObject.isCompleted){
 
        const undoButton = document.createElement("button");
        undoButton.classList.add("undoBtn");
        undoButton.addEventListener("click", function () {
            undoBookFromCompleted(bookObject.id);
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("trashBtn");
        trashButton.addEventListener("click", function () {
            removeBookFromCompleted(bookObject.id);
        });

        const EditButton = document.createElement("button");
        EditButton.classList.add("EditBtn");
        EditButton.addEventListener("click", function () {
            EditBook(bookObject.id);
        });

        const forButton = document.createElement("div");
        forButton.classList.add("action")
        forButton.append(undoButton, trashButton, EditButton);

        container.append(forButton);
    } else {
   
   
        const checkButton = document.createElement("button");
        checkButton.classList.add("checkBtn");
        checkButton.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trashBtn");
        trashButton.addEventListener("click", function () {
            removeBookFromCompleted(bookObject.id);
        });

        const EditButton = document.createElement("button");
        EditButton.classList.add("EditBtn");
        EditButton.addEventListener("click", function () {
            EditBook(bookObject.id);
        });

        const forButton = document.createElement("div");
        forButton.classList.add("action")
        forButton.append(checkButton, trashButton, EditButton);

        container.append(forButton);
   
    }
  
    return container;
	 
}

function addBookToCompleted(BookId) {
 
    const bookTarget = findBook(BookId);
    if(bookTarget == null) return;
      
        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
}
    
function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

function findBookIndex(bookId) {
    for(index in books){
        if(books[index].id === bookId){
            return index
        }
    }
    return -1
}

document.getElementById('searchSubmit').addEventListener("click", function(event){
    event.preventDefault();
   
    const search = document.getElementById('searchBookTitle');
    const searchBook = search.value.toLowerCase()
    const bookItem = document.querySelectorAll('.book_item > h3');
        for (book of bookItem) {
        if (searchBook !== book.innerText.toLowerCase()) {
          book.parentElement.style.display = "none";
        } else {
          book.parentElement.style.display = "block";
        }
      }
    search.value='';
  })

    
function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);
    swal("Berhasil","Sukses menghapus buku dari daftar", "success");   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
              
function undoBookFromCompleted(bookId){   
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return; 

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function EditBook(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    document.getElementById("inputBookTitle").value = bookTarget.tittle; 
	document.getElementById("inputBookAuthor").value = bookTarget.author; 
	document.getElementById("inputBookYear").value = bookTarget.year;
    document.getElementById("inputBookIsComplete").checked = false;
    
    const bookTarget2 = findBookIndex(bookId);
    if(bookTarget2 === -1) return;
    books.splice(bookTarget2, 1);   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});
