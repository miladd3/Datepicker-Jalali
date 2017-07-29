<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="datepicker.css">
</head>
<body>
<div class="container">
    <div class="calender"></div>
    <p dir="ltr">
        Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und diese durcheinander warf um ein Musterbuch zu erstellen. Es hat nicht nur 5 Jahrhunderte überlebt, sondern auch in Spruch in die elektronische Schriftbearbeitung geschafft (bemerke, nahezu unverändert). Bekannt wurde es 1960, mit dem erscheinen von "Letraset", welches Passagen von Lorem Ipsum enhielt, so wie Desktop Software wie "Aldus PageMaker" - ebenfalls mit Lorem Ipsum.
    </p>
    <div class="mycal"></div>
    <input type="text" id="calenderSelector">
</div>
<script src="jquery-3.2.1.min.js"></script>
<script src="datepicker.js"></script>
<script>
    $(document).ready(function(){
        $(".calender").datepicker({
            altField : "#calenderSelector",
            format : "long",
            date   : '2017-03-27'
        });
    });
</script>
</body>
</html>