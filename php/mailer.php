<html>
<body>
<?php

$name = $_POST['name'];
$email = $_POST['email'];
$body = $_POST['subject'];

//su altervista si utilizza il seguente codice (server SMTP attivo)

$headers = "From:" .$name . "\r\n" .'Reply-To:' .$email;
mail("dnlmss98@gmail.com", "SITO: Richiesta informazioni", "da: " .$email ."\n" .$body, $headers);

?>
<!-- ritornare alla pagina del prodotto -->
<script> history.go(-1) </script>
</body>
</html>
