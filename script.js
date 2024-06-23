var firebaseConfig = {

};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

// Firestore veritabanı referansını alma

var db = firebase.firestore();

console.log("Firebase connected");

// Kullanıcıdan isim girmesini isteme ve bu ismi bir değişkende saklama

var name = window.prompt("Enter your name");

// Tüm mesajları alıp gerçek zamanlı sohbeti dinleme

db.collection("chats").orderBy("date").onSnapshot(function (snapshot) {

    snapshot.docChanges().forEach(function (change, ind) {

        var data = change.doc.data();

        // Yeni bir mesaj eklendiğinde

        if (change.type == "added") {

            // Mesajı gönderen kişi bu kullanıcı ise

            if (data.senderName == name) {

                // Mesaj için HTML oluşturma ve sol tarafta gösterme

                var html = `<li class="left clearfix">
                    <span class="chat-img pull-left">
                        <img src="http://placehold.it/50/55C1E7/fff&text=${data.senderName}" alt="User Avatar" class="img-circle" />
                    </span>
                    <div class="chat-body clearfix">
                        <div class="header">
                            <strong class="primary-font">${data.senderName}</strong> <small class="pull-right text-muted">
                                <span class="glyphicon glyphicon-time"></span>${data.date}</small>
                        </div>
                        <p id="${change.doc.id}-message">
                            ${data.message}
                        </p>
                        <span onclick="deleteMessage('${change.doc.id}')" class="glyphicon glyphicon-trash"></span> 
                    </div>
                </li>`;

                $('.chat').append(html);

            } else {

                // Mesajı gönderen kişi bu kullanıcı değilse, sağ tarafta gösterme

                var html = `<li class="right clearfix">
                    <span class="chat-img pull-right">
                        <img src="http://placehold.it/50/FA6F57/fff&text=${data.senderName}" alt="User Avatar" class="img-circle" />
                    </span>
                    <div class="chat-body clearfix">
                        <div class="header">
                            <small class=" text-muted">
                                <span class="glyphicon glyphicon-time"></span>${data.date}</small>
                            <strong class="pull-right primary-font">${data.senderName}</strong>
                        </div>
                        <p id="${change.doc.id}-message">
                            ${data.message}
                        </p>
                        <span onclick="deleteMessage('${change.doc.id}')" class="glyphicon glyphicon-trash"></span> 
                    </div>
                </li>`;

                $('.chat').append(html);

            }

            // Son mesajda otomatik olarak aşağı kaydırma

            if (snapshot.docChanges().length - 1 == ind) {

                $(".panel-body").animate({ scrollTop: $('.panel-body').prop("scrollHeight") }, 1000);

            }

        }

        // Bir mesaj silindiğinde

        if (change.type == "removed") {

            // Silinen mesajın yerine bir bildirim koyma

            $("#" + change.doc.id + "-message").html("This message has been deleted.");

        }

    })

})

// Mesaj gönderme fonksiyonu

function sendMessage(object) {

    console.log(object);

    db.collection("chats").add(object).then(added => {

        console.log("Message sent ", added);

    }).catch(err => {

        console.err("Error occured", err);

    })

}

// Mesaj silme fonksiyonu

function deleteMessage(doc_id) {

    var flag = window.confirm("Are you sure to want delete?");

    if (flag) {

        db.collection("chats").doc(doc_id).delete();

        console.log("Deleted");

    }
    
}

// Gönder butonuna tıklandığında mesaj gönderme işlemi

$('.send-button').click(function () {

    var message = $('#btn-input').val(); // Mesaj input alanından mesajı alma

    if (message) { // Eğer mesaj boş değilse

        // Mesajı gönder

        sendMessage({

            senderName: name, // Gönderici adı

            message: message, // Mesaj içeriği

            date: moment().format("YYYY-MM-DD HH:mm") // Mesajın gönderildiği tarih ve saat

        })

        $('#btn-input').val(""); // Mesaj gönderildikten sonra input alanını temizleme

    }

})

// Kullanıcı enter tuşuna bastığında mesaj gönderme

$('#btn-input').keyup(function (event) {

    if (event.keyCode == 13) { // Eğer basılan tuş enter ise

        var message = $('#btn-input').val(); // Mesaj input alanından mesajı alma

        if (message) { // Eğer mesaj boş değilse

            // Mesajı gönder

            sendMessage({

                senderName: name, // Gönderici adı

                message: message, // Mesaj içeriği

                date: moment().format("YYYY-MM-DD HH:mm") // Mesajın gönderildiği tarih ve saat

            })

            $('#btn-input').val(""); // Mesaj gönderildikten sonra input alanını temizleme

        }

    }

    // console.log("Key pressed");

})