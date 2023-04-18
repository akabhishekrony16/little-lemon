export default function Validate_PhoneNumber(_phoneno){
    
    var validphoneRegex  = /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/;
    
    if(validphoneRegex.test(_phoneno)){
        return true
    }else{
        return false
    }
};