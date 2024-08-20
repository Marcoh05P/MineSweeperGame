let bomb = 0; //Biến chứa số lượng bomb
let flags = 0; //Biến chứa số lượng cờ
let trangthai = 0; //Biến chứa trạng thái level đã chọn hay chưa (Ngăn chặn người chơi chọn level khác)
let squares = []; //Mảng chứa tất cả các ô, dùng để thao tác
var gameOver = false; //Biến trạng thái game kết thúc
var intervalId; //Đối tượng trạng thái interval
var time; //Biến thời gian chạy


function clock() {
  var x;
  time = 0;
  clearInterval(intervalId); 
  intervalId = setInterval(function () //Tăng lên 1 mỗi giây khi game chưa thắng hoặc chưa reset
  {
    if (time == 3600)
      gameOver = true;
    else
    {
      time++;
      x = ( Math.floor(time/60) < 10? "0" + Math.floor(time/60): Math.floor(time/60) ) + ":" + (time%60 < 10? "0"+time%60:time%60)
      document.getElementById("clock").innerHTML = x;
    }
    if (gameOver) {
      clearInterval(intervalId);
    }
}, 1000);
}

function reset() //Reset lại màn chơi hiện tại (tải lại trang)
{
  location.reload();
}

function createEasyLevel() //Khởi tạo bảng chế độ dễ
{
  if (trangthai == 0) {
    size = 9;
    bomb = 10;
    createBoard();
    changeEasyLevelStyle();
    trangthai = 1;
  }
}

function changeEasyLevelStyle() //Thay đổi style của ô board cho đẹp, có tham khảo từ ChatGPT
{
  document.getElementById("board").style.width = "501px";
  var divs = document.querySelectorAll("#board div");
  divs.forEach(function (div) 
  {
    div.style.width = "54px";
    div.style.height = "54px";
    div.style.fontSize = "2em";
    div.style.lineHeight = "54px";
  });
}

function createMediumLevel() //Khởi tạo bảng ở chế độ thường
{
  if (trangthai == 0) {
    size = 16;
    bomb = 45;
    createBoard();
    changeMediumLevelStyle();
    trangthai = 1;
  }
  
}

function changeMediumLevelStyle()
{
  document.getElementById("board").style.width = "507px";
  var divs = document.querySelectorAll("#board div");
  divs.forEach(function (div)
  {
    div.style.width = "30px";
    div.style.height = "30px";
    div.style.fontSize = "1.5em";
    div.style.lineHeight = "30px";
  });
}

function createHardLevel() //Khởi tạo bảng ở chế độ khó
{
  if (trangthai == 0) {
    size = 25;
    bomb = 100;
    createBoard();
    changeHardLevelStyle();
    trangthai = 1;
  }
}

function changeHardLevelStyle()
{
  document.getElementById("board").style.width = "490px";
  var divs = document.querySelectorAll("#board div");
  divs.forEach(function (div)
  {
    div.style.width = "18px";
    div.style.height = "18px";
    div.style.fontSize = "1em";
    div.style.lineHeight = "18px";
  });
}

function createBoard() //Tạo bảng và bắt đầu trò chơi
{
  clock();
  document.getElementById("flag_left").innerHTML = bomb;
  document.getElementById("result").innerHTML = "💕Chinh phục nào!💕";
  //Tạo mảng 1 chiều lưu giá trị để tham chiếu vị trí đặt bom vào
  const bombArray = Array(bomb).fill("bomb");
  const emptyArray = Array(size * size - bomb).fill("valid");
  const gameArray = bombArray.concat(emptyArray).sort(() => Math.random() - 0.5);

  for (let i = 0; i < size * size; i++) //Tạo ma trận bom và xử lý sự kiện trên từng ô
  {
    //Tạo mảng 1 chiều chứa ma trận bom
    const square = document.createElement("div");
    square.id = i;
    square.classList.add(gameArray[i]);
    document.getElementById("board").appendChild(square);
    squares.push(square);

    //Xử lý sự kiện khi click chuột trái
    square.addEventListener("click", function () {
        click(square);
    });

    //Xử lý sự kiện khi click chuột phải
    square.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        addFlag(square);
    });
  }

  //Vòng lặp đếm số bom xung quanh và ghi số bom đã đếm vào tất cả các ô trong bảng
  for (let i = 0; i < squares.length; i++) {
    let dembom = 0;
    const canhTrai = (i % size === 0); //Đánh dấu ô là ô nằm ở cạnh trái
    const canhPhai = (i % size === size - 1); //Đánh dấu ô là ô nằm ở cạnh phải

    if (squares[i].classList.contains("valid")) {
      if (i > 0 && !canhTrai && squares[i - 1].classList.contains("bomb")) dembom++; //Kiểm tra ô bên trái
      if (i < (size * size) - 1 && !canhPhai && squares[i + 1].classList.contains("bomb")) dembom++; //Kiểm tra ô bên phải
      if (i >= size && squares[i - size].classList.contains("bomb")) dembom++;//Kiểm tra ô bên trên
      if (i < size * (size - 1) && squares[i + size].classList.contains("bomb")) dembom++;//Kiểm tra ô bên dưới
      if (i >= size && !canhTrai && squares[i - 1 - size].classList.contains("bomb")) dembom++;//Kiểm tra ô trên trái
      if (i >= size &&!canhPhai && squares[i + 1 - size].classList.contains("bomb")) dembom++;//Kiểm tra ô trên phải
      if (i < size * (size - 1) && !canhTrai && squares[i - 1 + size].classList.contains("bomb")) dembom++;//Kiểm tra ô dưới trái
      if (i < size * (size - 1) && !canhPhai && squares[i + 1 + size].classList.contains("bomb")) dembom++;//Kiểm tra ô dưới phải
      squares[i].setAttribute("data", dembom); //Ghi số bom vào ô
    }
  }
}


function click(square) //Hàm xử lý khi click chuột trái vào ô (Mở ô)
{
  if (gameOver || square.classList.contains("checked") || square.classList.contains("flaged"))
    return;

  if (square.classList.contains("bomb")) //Click trúng phải bom
  {
    document.getElementById("result").innerHTML = "😭Thua rồi!😭";
    gameOver = true; //Dừng game
    //Mở hết tất cả các ô có bom còn lại
    squares.forEach(function (square) 
    {
      if (square.classList.contains("bomb")) {
        square.classList.remove("bomb");
        square.classList.add("boom");
      }
    });
  } else //Không phải bom và mở ô đó ra
  {
    let so = square.getAttribute("data");
    //Mở các ô trống nếu tại ô đó xung quanh có chứa bom, đổi màu sắc cho chữ số bằng cách ghi thêm class
    if (so != 0)
    {
      square.classList.add("checked");
      if (so == 1) square.classList.add("one");
      if (so == 2) square.classList.add("two");
      if (so == 3) square.classList.add("three");
      if (so == 4) square.classList.add("four");
      if (so == 5) square.classList.add("five");
      if (so == 6) square.classList.add("six");
      if (so == 7) square.classList.add("seven");
      if (so == 8) square.classList.add("eight");
      square.innerHTML = so;
      return;
    }
    //Mở các ô trống khác và lan truyền đi
    moCacOTrong(square);
  }
  square.classList.add("checked");
}

function moCacOTrong(square) //Hàm mở các ô trống nếu tại ô đó số bom xung quanh là 0
{
  const IDHienTai = parseInt(square.id);
  const canhTrai = IDHienTai % size === 0;
  const canhPhai = IDHienTai % size === size - 1;

  //Dùng setTimeout để tạo hiệu ứng khai phá ô cho đẹp
  setTimeout(function (){
    //Tương tự như việc đếm bom, hàm này sẽ mở 8 ô xung quanh nó với các điều kiện ràng buộc, thực hiện gọi đệ quy lại hàm clicked() để lan truyền, điều kiện là ô này không chứa bom (Đảm bảm mở ra được các ô trống và chứa số)
    if (IDHienTai > 0 && !canhTrai) //Mở ô bên trái
    {
      const newId = IDHienTai - 1;
      const newSquare = document.getElementById(newId.toString());
      if (newSquare && !newSquare.classList.contains("bomb"))
        click(newSquare);
    }

    if (IDHienTai < size * size - 1 && !canhPhai) //Mở ô bên phải
    {
      const newId = IDHienTai + 1;
      const newSquare = document.getElementById(newId.toString());
      if (newSquare && !newSquare.classList.contains("bomb"))
        click(newSquare);
    }

    if (IDHienTai >= size) //Mở ô bên trên
    {
      const newId = IDHienTai - size;
      const newSquare = document.getElementById(newId.toString());
      if (newSquare && !newSquare.classList.contains("bomb"))
        click(newSquare);
    }

    if (IDHienTai < size * (size - 1)) //Mở ô bên dưới
    {
      const newId = IDHienTai + size;
      const newSquare = document.getElementById(newId.toString());
      if (newSquare && !newSquare.classList.contains("bomb"))
        click(newSquare);
    }

    if (IDHienTai >= size + 1 && !canhTrai) //Mở ô trên trái
    {
      const newId = IDHienTai - size - 1;
      const newSquare = document.getElementById(newId.toString());
      if (newSquare && !newSquare.classList.contains("bomb"))
        click(newSquare);
    }

    if (IDHienTai >= size && !canhPhai) //Mở ô trên phải
    {
      const newId = IDHienTai - size + 1;
      const newSquare = document.getElementById(newId.toString());
      if (newSquare && !newSquare.classList.contains("bomb"))
        click(newSquare);
    }

    if (IDHienTai < size * (size - 1) && !canhTrai) //Mở ô dưới trái
    {
      const newId = IDHienTai + size - 1;
      const newSquare = document.getElementById(newId.toString());
      if (newSquare && !newSquare.classList.contains("bomb"))
        click(newSquare);
    }

    if (IDHienTai < size * (size - 1) - 1 && !canhPhai) //Mở ô dưới phải
    {
      const newId = IDHienTai + size + 1;
      const newSquare = document.getElementById(newId.toString());
      if (newSquare && !newSquare.classList.contains("bomb"))
        click(newSquare);
    }
  }, 10);
}

function addFlag(square) //Hàm xử lý khi click chuột phải  vào ô (Hàm gắn cờ đánh dấu ô nghi ngờ chứa bom)
{
  if (gameOver || square.classList.contains("checked")) return;

  if (flags <= bomb) //Ngăn chặn việc đặt cờ nhiều hơn số bom
  {
    if (!square.classList.contains("flaged") && flags < bomb) //Gắn cờ nếu chưa đánh dấu
    {
      square.classList.add("flaged");
      flags++;
      document.getElementById("flag_left").innerHTML = bomb - flags;
      checkForWin(); //Kiểm tra điều kiện thắng
    }
    else if(square.classList.contains("flaged")) //Thu hồi lại cờ đã đánh dấu
    {
      square.classList.remove("flaged");
      flags--;
      document.getElementById("flag_left").innerHTML = bomb - flags;
    }
  }
}

function checkForWin() //Hàm kiểm tra điều kiện thắng
{
  let matches = 0; //Đếm số cờ đã đánh dấu đúng vị trí của bom

  for (let i = 0; i < squares.length; i++)
  {
    if (squares[i].classList.contains("flaged") && squares[i].classList.contains("bomb"))
      matches++;
  }

  if (matches == bomb) //Chiến thắng khi đặt hết cờ đúng vị trí
  {
    document.getElementById("result").innerHTML = "😊Bạn đã thắng!😊";
    gameOver = true;
  }
}
