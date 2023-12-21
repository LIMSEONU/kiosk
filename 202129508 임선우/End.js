//메인화면 표시

$(document).ready(function () {
    $("#menu1").show();

    $("#tab1").addClass("active");
});

function showMenu(menuId) {
    $(".menuSection").hide();
    
    $("#" + menuId).show();
}

function setActiveTab(tabId) {
    $("#tab1, #tab2, #tab3, #tab4, #tab5").removeClass("active");
    $("#" + tabId).addClass("active");
}

$("#menuBar a").on("click", function () {
    var menuId = $(this).attr("id").replace("tab", "menu");
    
    $(".menuSection").removeClass("show");

    $("#" + menuId).addClass("show");

    setActiveTab($(this).attr("id"));
});

//========================================장바구니=============================================

let cart = [];
let total = 0; 

// 주문 목록 비우기
function clearOrderList() {
    cart = []; 
    updateCart(); 
}

// 장바구니에 제품 추가
function addToCart(pillname, price) {

    let index = cart.findIndex(item => item.pillname === pillname);

    if (index !== -1) {
        cart[index].quantity++;
        cart[index].subtotal = cart[index].quantity * price;
    } else {
        cart.push({
            pillname: pillname,
            price: price,
            quantity: 1,
            subtotal: price
        });
    }

    updateCart();
    updateReceipt();
}

// 장바구니 업데이트
function updateCart() {

    let cartList = $('#cart');
    cartList.empty();

    cart.forEach(item => {
        let listItem = $('<li class="list-group-item"></li>');
        listItem.text(`${item.pillname} - ${item.price.toLocaleString()}원 x ${item.quantity}개 = ${item.subtotal.toLocaleString()}원`);
        cartList.append(listItem);
    });

    // 총 가격
    total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    $('#totalPrice').text(`${total.toLocaleString()}원`);
}

$('.item').click(function () {
    let pillname = $(this).find('.itemDetails b').text().trim();
    let priceText = $(this).find('.itemDetails p').text().trim();
    let price = parseInt(priceText.replace(/[^0-9]/g, ''), 10); 
    addToCart(pillname, price);
});


$('#cart').on('click', 'li', function () {
    let pillname = $(this).text().split(' - ')[0];
    removeCartItem(pillname);
});

function removeCartItem(pillname) {
  let index = cart.findIndex(item => item.pillname === pillname);

  if (index !== -1) {
      total -= cart[index].subtotal;
      cart.splice(index, 1);
      updateCart();
  }
}

//============================영수증=======================================
function updateReceipt(paymentAmount) {
    let receiptContent = $('#receiptContent');
    receiptContent.empty(); 
  
    // 주문 목록 및 총 가격 표시
    cart.forEach(item => {
        let itemLine = `<p><strong> :) </strong>${item.pillname} - ${item.price.toLocaleString()}원 x ${item.quantity}개 = ${item.subtotal.toLocaleString()}원</p>`;
        receiptContent.append(itemLine);
    });
  
    let totalPriceLine = `<p><strong>총 가격: </strong>${total.toLocaleString()}원</p>`;
    receiptContent.append(totalPriceLine);
 
    if (paymentAmount !== undefined) {
      let userPaymentLine = `<p><strong>지출 비용: </strong>${paymentAmount.toLocaleString()}원</p>`;
      receiptContent.append(userPaymentLine);
    }
  
    let dateLine = `<p><strong> :) </strong>${getCurrentDateTimeString()}</p>`;
    $('#receiptDateTime').html(dateLine);
  }
  
  function closeModal() {
    $('#paymentModal').hide();
  }
  
  //결제 금액 입력 함수
  function checkout() {
    let paymentAmount = prompt("결제할 금액을 입력하세요:");
  
    if (!paymentAmount || isNaN(paymentAmount)) {
        alert("유효하지 않은 결제 금액입니다. 올바른 숫자를 입력해주세요.");
        return;
    }
  
    paymentAmount = parseFloat(paymentAmount);
  
    if (paymentAmount < total) {
        alert("부족한 결제 금액입니다. 총액 이상의 금액을 입력해주세요.");
        return;
    }
  
    updateReceipt(paymentAmount);
    $('#paymentModal').show();
    clearOrderList();
  }

  

//영수증 날짜 함수

function getCurrentDateTimeString() {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
  let day = currentDate.getDate().toString().padStart(2, '0');
  let hours = currentDate.getHours().toString().padStart(2, '0');
  let minutes = currentDate.getMinutes().toString().padStart(2, '0');
  let seconds = currentDate.getSeconds().toString().padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
}

function printReceipt() {
    let printContent = $('#paymentModal').html();

    // 새 창 열기
    let printWindow = window.open('', '_blank');

    printWindow.document.write('<html><head><title>영수증 인쇄</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');

    printWindow.print();
}
//DIT약국 누르면 웹페이지 새로고침
function reloadPage() {
    location.reload();
}