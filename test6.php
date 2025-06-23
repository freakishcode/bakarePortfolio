<?php
    //stating condition if input fields are not empty
    if(isset($_POST['send'])){
        //collecting inputs data from FORM
        $clientName = trim($_POST['username']);
        $clientEmail = trim($_POST['email']);
        $clientMessage = trim($_POST['msg']);
        $toEmail = 'ajibolaolayemibakare@yahoo.com';

        $mailHeaders =
        "From" . $clientName .
        "\r\n Email:" . $clientEmail .
        "\r\n Message:" . $clientMessage . "\r\n" ;

        // To send the Mail
        mail($toEmail, $clientName, $mailHeaders);
        header("Location: test6.php?mailSend");
    }
?>