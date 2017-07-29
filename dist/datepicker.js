(function ( $ ) {
    //TODO maxDate on month , Year
    // TODO max Year check
    // TODO view Month , Years
    var settings = null;
    $.fn.datepicker = function( options ) {
        // This is the easiest way to have default options.
        settings = $.extend({
            // These are the defaults.
            altField : "",
            minDate  : null,
            maxDate  : null,
            maxYear  : 1420,
            minYear  : 1320,
            navRight : "<",
            navLeft  : ">",
            today    : true,
            format   : "short",
            view : "day",
            date : "1991-01-02"
        }, options );
        // Greenify the collection based on the settings variable.
        return renderDatePicker(this,settings.date);
 
    };
    function renderDatePicker(_,d){
        var darr = d.split("-");
        var sh_date = ToShamsi(parseInt(darr[0]),parseInt(darr[1]),parseInt(darr[2]),"short");
        var sh_date_array = sh_date.split("-");
        settings.shYear = sh_date_array[0];
        settings.cshYear = sh_date_array[0];
        settings.shMonth = sh_date_array[1];
        settings.cshMonth = sh_date_array[1];
        settings.shDay = sh_date_array[2];
        settings.cshDay = sh_date_array[2];
        settings.navigator = "month";
        $.tmplMustache(TEMPLATE.datepciker,dataTemplate).appendTo(_);
        $.tmplMustache(TEMPLATE.navigator,{navRight : settings.navRight , navLeft : settings.navLeft,content : settings.shYear+" - "+calNames("hf",settings.shMonth - 1) }).appendTo($("."+dataTemplate.css.datePickerPlotArea+" ."+dataTemplate.css.navigator,_));
        $.tmplMustache(TEMPLATE.months,dataTemplate).appendTo($(s.datePickerPlotArea+" "+ s.monthView,_));
        renderMonth(_);
        renderDays(_);
        initEvents(_);
        $(settings.altField).val(formatAltField(settings.shYear,settings.shMonth,settings.shDay,settings.format));
    }
    function renderNavigator(_){
        $(s.datePickerPlotArea+" "+ s.navigator + " .nav-content",_).html(settings.shYear+" - "+calNames("hf",settings.shMonth - 1));
        renderMonth(_);
        renderDays(_);
    }
    function renderDays(_){
        var maxDay = 31;
        if(settings.shMonth > 6 && settings.shMonth<12){
            maxDay = 30;
        }else if(settings.shMonth == 12 && hshIsLeap(settings.shYear)){
            maxDay = 30;
        }else if(settings.shMonth == 12){
            maxDay = 29;
        }
        $(s.datePickerPlotArea+" "+s.dayView,_).html('');
        $.tmplMustache(TEMPLATE.monthGrid,dataTemplate).appendTo($(s.datePickerPlotArea+" "+s.dayView,_));
        var first_day = hshDayOfWeek(settings.shYear,settings.shMonth,1);
        var week = 1 ;
        for (var i = 1 ; i <= first_day ; i++){
            $.tmplMustache("<td>&nbsp;</td>",{}).appendTo($(s.datePickerPlotArea+" "+s.dayView+" "+ s.tableMonthGrid+ " tr[data-week='"+week+"']",_));
        }
        for(var i = 1 ; i <= maxDay ; i++){
            if(checkMaxDate(settings.shYear,settings.shMonth,i)){
                break;
            }
            if(first_day>=7){
                first_day = 0 ;
                week++;
            }
            if(settings.shYear == settings.cshYear && settings.shMonth == settings.cshMonth && settings.cshDay == i){
                $.tmplMustache(TEMPLATE.days,{day : i , today:"today"}).appendTo($(s.datePickerPlotArea+" "+s.dayView+" "+ s.tableMonthGrid+ " tr[data-week='"+week+"']",_));
            }else{
                $.tmplMustache(TEMPLATE.days,{day : i}).appendTo($(s.datePickerPlotArea+" "+s.dayView+" "+ s.tableMonthGrid+ " tr[data-week='"+week+"']",_));
            }
            first_day++;
        }
    }

    function renderMonth(_){
        var season = 1;
        $(s.datePickerPlotArea+" "+ s.monthView,_).html("");
        $.tmplMustache(TEMPLATE.months,dataTemplate).appendTo($(s.datePickerPlotArea+" "+ s.monthView,_));
        for(var i = 1 ; i <= 12 ; i++ ){
            if(checkMaxDate(settings.shYear,i)){
                break;
            }
            $.tmplMustache(TEMPLATE.eachMonth,{monthNumber : i , month : calNames("hf",i-1)}).appendTo($(s.datePickerPlotArea+" "+ s.monthView+" "+ s.tableMonths+" tr[data-season='"+season+"']",_));
            if(i % 3 == 0){
                season++;
            }
        }
    }
    var grgSumOfDays=Array(Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365),Array(0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366));
    var hshSumOfDays=Array(Array(0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 365), Array(0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 366));

    function ToShamsi(grgYear,grgMonth,grgDay,Format)
    {
        var hshYear = grgYear-621;
        var hshMonth,hshDay;
        
        var grgLeap=grgIsLeap (grgYear);
        var hshLeap=hshIsLeap (hshYear-1);
        
        var hshElapsed;
        var grgElapsed = grgSumOfDays[(grgLeap ? 1:0)][grgMonth-1]+grgDay;

        var XmasToNorooz = (hshLeap && grgLeap) ? 80 : 79;

        if (grgElapsed <= XmasToNorooz)
        {
            hshElapsed = grgElapsed+286;
            hshYear--;
            if (hshLeap && !grgLeap)
                hshElapsed++;
        }
        else
        {
            hshElapsed = grgElapsed - XmasToNorooz;
            hshLeap = hshIsLeap (hshYear);
        }

        for (var i=1; i <= 12 ; i++)
        {
            if (hshSumOfDays [(hshLeap ? 1:0)][i] >= hshElapsed)
            {
                hshMonth = i;
                hshDay = hshElapsed - hshSumOfDays [(hshLeap ? 1:0)][i-1];
                break;
            }
        }


        if (Format.toLowerCase() == "long")
            return hshDayName (hshDayOfWeek(hshYear,hshMonth,hshDay)) + "  " + hshDay + " " + calNames("hf", hshMonth-1) + " " + hshYear;
        else
            return hshYear + "-" + hshMonth + "-" + hshDay;
    }


    function formatAltField(hshYear,hshMonth,hshDay,Format){
        if (Format.toLowerCase() == "long")
            return hshDayName (hshDayOfWeek(hshYear,hshMonth,hshDay)) + "  " + hshDay + " " + calNames("hf", hshMonth-1) + " " + hshYear;
        else
            return hshYear + "-" + hshMonth + "-" + hshDay;
    }


    function ToGregorian (hshYear,hshMonth,hshDay)
    {
        var grgYear = hshYear+621;
        var grgMonth,grgDay;

        var hshLeap=hshIsLeap (hshYear);
        var grgLeap=grgIsLeap (grgYear);

        var hshElapsed=hshSumOfDays [hshLeap ? 1:0][hshMonth-1]+hshDay;
        var grgElapsed;

        if (hshMonth > 10 || (hshMonth == 10 && hshElapsed > 286+(grgLeap ? 1:0)))
        {
            grgElapsed = hshElapsed - (286 + (grgLeap ? 1:0));
            grgLeap = grgIsLeap (++grgYear);
        }
        else
        {
            hshLeap = hshIsLeap (hshYear-1);
            grgElapsed = hshElapsed + 79 + (hshLeap ? 1:0) - (grgIsLeap(grgYear-1) ? 1:0);
        }

        for (var i=1; i <= 12; i++)
        {
            if (grgSumOfDays [grgLeap ? 1:0][i] >= grgElapsed)
            {
                grgMonth = i;
                grgDay = grgElapsed - grgSumOfDays [grgLeap ? 1:0][i-1];
                break;
            }
        }

        return grgYear+"-"+grgMonth+"-"+grgDay;
    }

    function hshDayOfWeek(hshYear, hshMonth, hshDay)
    {
        var value;
        value = hshYear - 1376 + hshSumOfDays[0][hshMonth-1] + hshDay - 1;

        for (var i=1380; i<hshYear; i++)
            if (hshIsLeap(i)) value++;
        for (var i=hshYear; i<1380; i++)
            if (hshIsLeap(i)) value--;

        value=value%7;
        if (value<0) value=value+7;

        return (value);
    }

    function grgIsLeap (Year)
    {
        return ((Year%4) == 0 && ((Year%100) != 0 || (Year%400) == 0));
    }

    function hshIsLeap (Year)
    {
        Year = (Year - 474) % 128;
        Year = ((Year >= 30) ? 0 : 29) + Year;
        Year = Year - Math.floor(Year/33) - 1;
        return ((Year % 4) == 0);
    }

    function hshDayName(DayOfWeek)
    {
        return calNames("df", DayOfWeek%7);
    }

    function calNames(calendarName, monthNo)
    {
        switch (calendarName)
        {
            case "hf": return Array("فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند")[monthNo];
            case "ge": return Array(" January ", " February ", " March ", " April ", " May ", " June ", " July ", " August ", " September ", " October ", " November ", " December ")[monthNo];
            case "gf": return Array("ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوثن", "ژوییه", "اوت", "سپتامبر", "اكتبر", "نوامبر", "دسامبر")[monthNo];
            case "df": return Array("شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه")[monthNo];
            case "de": return Array("Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday")[monthNo];
        }
    }

    $.tmplMustache = function (input, dict) {
        // Micro Mustache Template engine
        String.prototype.format = function string_format(arrayInput) {
            function replacer(key) {
                var keyArr = key.slice(2, -2).split("."), firstKey = keyArr[0], SecondKey = keyArr[1];
                if (arrayInput[firstKey] instanceof Object) {
                    return arrayInput[firstKey][SecondKey];
                } else {
                    return arrayInput[firstKey];
                }
            }

            return this.replace(/{{\s*[\w\.]+\s*}}/g, replacer);
        };
        return $(input.format(dict));
    };

    function initEvents(e){
        var self = e ;
        $(s.datePickerPlotArea+" "+ s.navigator+" "+".nav-right",e).bind("click",function(){
            return navigator(self,"prev");
        });
        $(s.datePickerPlotArea+" "+ s.navigator+" "+".nav-left",e).bind("click",function(){
            navigator(self,"next");
        });
        $(s.datePickerPlotArea+" "+ s.dayView,e).on("click",".day",function(){
            $(settings.altField).val(formatAltField(settings.shYear,settings.shMonth,$(this).attr('data-val'),settings.format));
        });
    }

    function navigator(e,to){
        switch (to){
            case "next":
                switch (settings.navigator) {
                    case "month":
                        if(checkMaxDate(settings.shYear,parseInt(settings.shMonth) + 1)){
                            return false;
                        }
                        settings.shMonth = parseInt(settings.shMonth) + 1;
                        if(settings.shMonth > 12) {
                            settings.shMonth = 1;
                            settings.shYear = parseInt(settings.shYear) + 1;
                        }
                        renderNavigator(e);
                        break;
                }
                break;
            case "prev":
                switch (settings.navigator) {
                    case "month":
                        settings.shMonth =  parseInt(settings.shMonth) - 1;
                        if(settings.shMonth < 1){
                            settings.shMonth = 12;
                            settings.shYear = parseInt(settings.shYear) - 1;
                        }
                        renderNavigator(e);
                        break;
                }
                break;
        }
    }

    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    function checkMaxDate(y,m,d){
        d = d || 1 ;
        if(y+"-"+zeroPad(m,2)+"-"+zeroPad(d,2) >= settings.maxDate)
            return true;
        return false;
    }

    function checkMinDate(y,m,d){
        d = d || 1 ;
        if(y+"-"+zeroPad(m,2)+"-"+zeroPad(d,2) >= settings.maxDate)
            return true;
        return false;
    }

    //selectors
    var s = {
        datePickerPlotArea : ".datepicker-jalali",
        navigator : ".datepicker-navigator",
        tableMonthGrid : ".datepicker-tablemonthgrid",
        tableMonths : ".datepicker-tablemonths",
        tableYears : ".datepicker-tableyears",
        dayView : ".datepicker-days",
        monthView : ".datepicker-month",
        yearView : ".datepicker-years",
        toolbox : ".datepicker-tools",
        day : ".day"
    }

    var dataTemplate = {
        css : {
            datePickerPlotArea : "datepicker-jalali",
            navigator : "datepicker-navigator",
            tableMonthGrid : "datepicker-tablemonthgrid",
            tableMonths : "datepicker-tablemonths",
            tableYears : "datepicker-tableyears",
            dayView : "datepicker-days",
            monthView : "datepicker-month",
            yearView : "datepicker-years",
            toolbox : "datepicker-tools",
        }
    };

    var TEMPLATE  = {
        datepciker: "<div class='{{css.datePickerPlotArea}}' >" + //
        "<div class='{{css.navigator}}' ></div>" +//
        "<div class='{{css.dayView}}' ></div>" + //
        "<div class='{{css.monthView}}' ></div>" + //
        "<div class='{{css.yearView}}' ></div>" + //
        "<div class='{{css.toolbox}}' ></div>" + //
        "</div>",
        year : "<div class='child-{{number}}'>{{number}}</div>",
        navigator : "<span class='nav-right'>{{navRight}}</span>" +
        "<span class='nav-left'>{{navLeft}}</span>"+
        "<span class='nav-content'>{{content}}</span>",
        months : "<table>" +
        "<tbody class='{{css.tableMonths}}'>" +
        "<tr data-season='1'></tr>" +
        "<tr data-season='2'></tr>" +
        "<tr data-season='3'></tr>" +
        "<tr data-season='4'></tr>" +
        "</tbody>"+
        "</table>",
        eachMonth : "<td><span class='month {{thisMonth}}' data-val='{{monthNumber}}'>{{month}}</span></td>",
        monthGrid : "<table>" +
        "<thead><th>ش</th><th>ی</th><th>د</th><th>س</th><th>چ</th><th>پ</th><th>ج</th></thead>" +
        "<tbody class='{{css.tableMonthGrid}}'>" +
        "<tr data-week='1'></tr>" +
        "<tr data-week='2'></tr>" +
        "<tr data-week='3'></tr>" +
        "<tr data-week='4'></tr>" +
        "<tr data-week='5'></tr>" +
        "<tr data-week='6'></tr>" +
        "</tbody>" +
        "</table>",
        days : "<td><span class='day {{today}}' data-val='{{day}}'>{{day}}</span></td>"

    };
}( jQuery ));