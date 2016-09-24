Number.prototype.formatMoney = function(c, d, t) {
    
    var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
        j = (j = i.length) > 3 ? j % 3 : 0;
   
    return s + (j ? i.substr(0, j) + t : "") + 
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + 
        (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

Number.prototype.pad = function() {
    if (this > -10 && this < 10) {

        var val = '';

        if (this < 0)
        {
            val = '-';               
        }

        val += '0' + Math.abs(this);

        return val;
    }
    else
    {
        return new String(this);
    }
};

Date.prototype.format = function(format) {

    if (!format)
    {
        format = "M/dd/yyyy h:mm AP";
    }

    // MM = Month with padding
    format = format.replace(/MM/g, (this.getMonth() + 1).pad());
    // M = Month with no padding
    format = format.replace(/M/g, this.getMonth() + 1);
    // DD = Day of the month with padding
    format = format.replace(/DD/g, this.getDate().pad());
    // dd = Day of the month with no padding
    format = format.replace(/dd/g, this.getDate());
    // yyyy = Four-digit year
    format = format.replace(/yyyy/g, this.getFullYear());
    // yy = Two-digit year
    format = format.replace(/yy/g, this.getYear());
    // HH = Hour of the day (24 hour clock) with padding
    format = format.replace(/hh/g, this.getHours().pad());
    // hh = Hour of the day (12 hour clock) with padding
    format = format.replace(/hh/g, this.getHours() > 12 ? (this.getHours() - 12).pad() : this.getHours().pad());
    // H = Hour of the day (24 hour clock) with no padding
    format = format.replace(/H/g, this.getHours());
    // h = Hour of the day (12 hour clock) with no padding
    format = format.replace(/h/g, this.getHours() > 12 ? this.getHours() - 12 : this.getHours());
    // mm = Minutes with padding
    format = format.replace(/mm/g, this.getMinutes().pad());
    // m = Minutes without padding
    format = format.replace(/m/g, this.getMinutes());
    // AP or ap = "AM" or "PM"
    format = format.replace(/AP/gi, this.getHours() >= 12 ? "PM" : "AM");
    
    return format;
};