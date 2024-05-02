export function MessengersConverter(value) {
    let result = 'EMAIL';
    switch (value) {
        case "mailImage":
            result = "EMAIL";
            break;
        case "vkImage":
            result = "VK";
            break;
        case "wsImage":
            result = "WHATSAPP";
            break;
        case "tgImage":
            result = "TELEGRAM";
            break;
        default:
            break;
    }
    console.log(value);
    return result;
}
