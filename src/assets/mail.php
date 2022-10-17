<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
$json = file_get_contents('php://input');
$params = json_decode($json);

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 0;                                       // Enable verbose debug output
    $mail->isSMTP();                                            // Set mailer to use SMTP
    $mail->Host       = 'smtp.mail.com';  			            // Specify main and backup SMTP servers        <----------------
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = '921charly@gmail.com';                  // SMTP username			       <---------------- 
    $mail->Password   = '7523nueve2uno2728';                            // SMTP password			       <----------------	
    $mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
    $mail->Port       = 587;                                    // TCP port to connect to

    //Recipients

    $mail->setFrom('nine2one@live.com.mx', 'PEPE GAUCHO!' );					//		<---------------
    $mail->addAddress( $params->email );     		// Add a recipient
    

    /* if(file_exists("data.txt")){
                         
      $fo = fopen("data.txt","r");                         
      $contents = fread($fo,filesize("data.txt"));                         
      fclose($fo);
    }
    if(file_exists("image.txt")){                         
      $ffo = fopen("image.txt","r");                         
      $srcImg = fread($ffo,filesize("image.txt"));                         
      fclose($ffo);
    } */


    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    //$mail->AddEmbeddedImage('./images/'.$srcImg, 'promo');
    //$mail->Body = "<p><img src=\"cid:promo\" /></p><p>" . utf8_decode('' . $contents) . "</p>";
    $mail->Subject = 'Encuesta de salida';
    $mail->Body    = 'Gracias por llenar la encuesta. ¡Disfruta de las promociones que tenemos para ti!.';
   // $mail->AltBody = 'Gracias por llenar la encuesta. ¡Disfruta de las promociones que tenemos para ti!.';

  

    $mail->send();
    echo 'Message has been sent';
    } catch (Exception $e) {
      echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
  
?>