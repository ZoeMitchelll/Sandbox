<?php 
        if(isset($_POST['submit'])){
            <!-- $to = "mitchellzh101@gmail.com";
            $from = $_POST['email'];
            $first_name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $subject = "Form submission";
            $subject2 = "Copy of your form submission";
            $message = $first_name . " " . $last_name . " wrote the following:" . "\n\n" . $_POST['message'];
            $message2 = "Here is a copy of your message " . $first_name . "\n\n" . $_POST['message'];

            $headers = "From:" . $from . "\r\n" .
            'Reply-To: zmitchel@xula.edu' . "\r\n" .
            $headers2 = "From:" . $to;
            mail($to,$subject,$message,$headers);
            mail($from,$subject2,$message2,$headers2);
            echo "Mail Sent. Thank you " . $first_name . ", we will contact you shortly."; -->
            header('Location: /about.html');
            }
  ?>