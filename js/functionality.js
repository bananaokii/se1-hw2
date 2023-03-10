var DEBUG = true;

if(DEBUG)
{
    console.log("DEBUG ON");
}

// หากต้องการแสดงผลใน console ให้ใช้ฟังก์ชั่นนี้
// หากไม่ต้องการแสดงผลใน console ให้ปรับค่า DEBUG = false;
function dbg()
{
    if(DEBUG)
    {
        console.log.apply(null, arguments);
    }
}

// ตารางเดือน
var months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]

// ตัวแปรสำหรับเก็บค่าวันที่ถูกคลิก เดือน/ปีที่ถูกเลือก
var date = new Date();
var currentDay = -1;
var currentMonth = date.getMonth();
var currentYear = date.getFullYear();
var database = JSON.parse(localStorage.getItem("database")) || {};
  
//JSON.stringify() เปลี่ยน obj เป็น String
//JSON.parse() เปลี่ยน String เป็น obj


// ตัวแปรสำหรับเก็บข้อมูลการนัดที่ถูกเพิ่ม/ลบ
// Structure คือ 
/* 
{
    "ปี-เดือน-วัน": [{"id": ไอดี, "desc": คำอธิบายนัด, "time": คำอธิบายเวลานัด}, {"id": ไอดี, "desc": คำอธิบายนัด, "time": คำอธิบายเวลานัด} ...],
    "ปี-เดือน-วัน": [{"id": ไอดี, "desc": คำอธิบายนัด, "time": คำอธิบายเวลานัด}, {"id": ไอดี, "desc": คำอธิบายนัด, "time": คำอธิบายเวลานัด} ...]
    ...
}
ตัวอย่าง
{
    "2022-0-11": [{"id": 0, "desc": "นัดเจอแฟนวันที่ 11 มกราคม", "time": "10 โมงที่เก่า"}, {"id": 1, "desc": "นัดเจอกิ๊กวันที่ 11 มกราคม", "time": "สองทุ่มที่เก่า"}],
    "2022-11-7": [{"id": 0, "desc": "นัดเจอแฟนเก่าวันที่ 7 ธันวาคม", "time": "10 โมงที่เก่า"}]
}
*/
let eStore = JSON.parse(localStorage.getItem("events")) || {};

// ฟังก์ชั่นสำหรับล้างปฏิทิน
function clearCalendar()
{
    document.getElementById("week1").innerHTML = "";
    document.getElementById("week2").innerHTML = "";
    document.getElementById("week3").innerHTML = "";
    document.getElementById("week4").innerHTML = "";
    document.getElementById("week5").innerHTML = "";
    document.getElementById("week6").innerHTML = "";

    // สังเกตดูว่ามี element ไหนอีกที่เราต้องเคลียจากตาราง แล้วเติมให้ถูกต้อง

}

// ฟังก์ชั่นสำหรับอัพเดทปฏิทิน คือ ล้างก่อน แล้วเติมข้อมูล
function updateCalendar()
{
    clearCalendar();

    document.getElementById("currentMonth").innerHTML = String(months[currentMonth]);
    document.getElementById("currentYear").innerHTML = String(currentYear);
    // ใส่ค่าที่อัพเดทให้กับปฏิทิน
    
    insertCalendar();
}

function insertCalendar()
{
    var currentDay = 1;
    var dNow = new Date(currentYear,currentMonth,currentDay);
    
    maxDate = 32 - new Date(currentYear,currentMonth,32).getDate();

        
    for(var r=1; r<7; r++)
    {
        var row = document.getElementById("week"+String(r));

        
        for(var d=0; d<7; d++)
        {
            
            dNow = new Date(currentYear,currentMonth,currentDay);
            
            if (d == dNow.getDay() && currentDay <= maxDate) {
                const node = document.createElement("td");
                node.className = "day";
                node.setAttribute("onclick","showModal(" + String(currentDay) + ")");
                node.innerHTML = '<div class="date">' + String(currentDay) + '</div>';
                
                if (Object.keys(database).length > 0) {
                  // Create element for displaying appointment list
                  let eventList = document.createElement("ul");
                  eventList.className = "event";
              
                  let sortedDates = Object.keys(database).sort((a, b) => {
                    let [dayA, monthA, yearA] = a.split("-");
                    let [dayB, monthB, yearB] = b.split("-");
              
                    return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
                  });
              
                  // Create array of events sorted by date
                  let sortedEvents = sortedDates.map(date => {
                    let [day, month, year] = date.split("-");
                    return database[date].map(event => {
                      event.date = new Date(year, month - 1, day);
                      return event;
                    });
                  }).flat().sort((a, b) => a.date - b.date);
              
                  // วนลูปเพื่อเพิ่มรายการนัดหมายลงใน eventList
                  for (const event of sortedEvents) {
                    let eventDate = new Date(event.date);
                    let eventDesc = event.desc;
                    let eventTime = event.time;
                    if (
                        eventDate.getDate() === currentDay &&
                        eventDate.getMonth() === currentMonth &&
                        eventDate.getFullYear() === currentYear &&
                        eventDesc && 
                        eventTime
                    ) {
                        let listItem = document.createElement("li");
                
                        let eventDescElement = document.createElement("div");
                        eventDescElement.className = "event-desc";
                        let eventDescText = document.createTextNode(eventDesc);
                        eventDescElement.appendChild(eventDescText);
                
                        let eventTimeElement = document.createElement("div");
                        eventTimeElement.className = "event-time";
                        let eventTimeText = document.createTextNode(eventTime);
                        eventTimeElement.appendChild(eventTimeText);
                
                        listItem.appendChild(eventDescElement);
                        listItem.appendChild(eventTimeElement);
                
                        eventList.appendChild(listItem);
                    }
                }
                
                // เช็คว่า eventList มี child nodes หรือไม่
                if (eventList.childNodes.length > 0) {
                    node.appendChild(eventList);
                }
                
                    
                }
                row.appendChild(node);
                currentDay += 1;
            }
            else
            {
                const node = document.createElement("td");
                node.className = "day other-month";
                row.appendChild(node);
            }
            
        }
    }
}

// ฟังก์ชั่นสำหรับเลื่อนเดือนไปเดือนก่อนหน้า
function prevMonth()
{
    // ดูตัวอย่างจากฟังก์ชั่น nextMonth() อย่าลืมเช็คกรณีที่เลขที่เดือนน้อยกว่า 0 ให้วนกลับไปที่ 11
    currentMonth = (currentMonth - 1)%12;

    if(currentMonth < 0)
    {
        date = new Date(currentYear,currentMonth);
        currentYear = date.getFullYear();
        currentMonth = date.getMonth();
    }else{
        date = new Date();
    }

    updateCalendar();
}

// ฟังก์ชั่นสำหรับเลื่อนเดือนไปเดือนถัดไป
function nextMonth()
{
    // ตัวแปร currentMonth ควรมีค่าตั้งแต่ 0-11 (0 คือ มกราคม, 11 คือ ธันวาคม)
    // เพิ่มค่าตัวแปร currentMonth อีก 1 ถ้าเพิ่มแล้วเกิน 12 ให้วนกลับไป 0
    currentMonth = (currentMonth + 1);

    if(currentMonth > 11)
    {
        date = new Date(currentYear,currentMonth);
        currentYear = date.getFullYear();
        currentMonth = date.getMonth();
    }else{
        date = new Date();
    }

    updateCalendar();
}

// ฟังก์ชั่นสำหรับเลื่อนปีไปปีก่อนหน้า
function prevYear()
{
    // ตัวแปร currentYear ควรมีค่ามากกว่า 0
    // ลบค่าตัวแปร currentYear ลงหนึ่งแล้วอัพเดทปฏิทิน
    currentYear -= 1;

    if(currentYear < 0)
    {
        currentYear = 0;
    }

    updateCalendar();
}

// ฟังก์ชั่นสำหรับเลื่อนปีไปปีถัดไป
function nextYear()
{
    // ดูตัวอย่างจากฟังก์ชั่น prevYear()
    currentYear += 1;
    updateCalendar();
}

// ฟังก์ชั่นสำหรับเซฟนัดสำหรับวันที่คลิก
function saveData()
{
    // สิ่งที่ต้องทำ loop เช็ค form ทั้งหมดใน Modal และดึงค่าที่ผู้ใช้อาจจะอัพเดทออกมา ก่อนที่จะเซฟลงไปที่ฐานข้อมูลของเรา
    // คำแนะนำ: ใช้ document.getElementsByClassName เพื่อที่จะดึงค่าของ textarea และ input ของคลาส modal-descriptions และ modal-times
    // ค่าที่ return จะเป็น array ซึ่งเราจะต้องใช้ for loop ในการเข้าถึงค่าของแต่ละตัว
    let descriptions = document.getElementsByClassName('modal-descriptions');
    let times = document.getElementsByClassName('modal-times');
    let key = String(currentDay) + "-" + String(currentMonth + 1) + "-" + String(currentYear);
    let array = database[key] || [];

    for (let i = 0; i < descriptions.length; i++) {
        let desc = descriptions[i].value;
        let time = times[i].value;
        
        if (desc !== "" && time !== "") {
            array.push({"desc": desc, "time": time});
        }
    }
    
    database[key] = array;
    localStorage.setItem("database", JSON.stringify(database));
    dbg(descriptions, times);
}

// ฟังก์ชั่นสำหรับแสดงผล Modal (รายละเอียดวันที่คลิก)
function showModal(day)
{
    let modal = document.getElementById("detail-modal");
    currentDay = day;
    modal.style.display = "block";
    document.getElementById("modal-h2").innerHTML = String(day) + " " + months[currentMonth] + " " + String(currentYear);
    
    document.getElementById("modal-body").innerHTML = "";
    //เติมค่าลงไปตามวันที่
    let key = String(currentDay) + "-" + String(currentMonth + 1) + "-" + String(currentYear);
    if(database[key] != null)
    {
        let id = 0;

        for(let arr of database[key])
        {
            dbg(arr['desc']);
            document.getElementById("modal-body").innerHTML += `
            <div id=r-`+String(id) +`>
            <hr> <textarea class="modal-descriptions" placeholder="รายละเอียด">` + arr['desc'] + `</textarea><br>
            <input type="text" class="modal-times" placeholder="เวลา" value="`+ arr['time'] +`"> 
            <span onclick="removeEvent(` + String(id) + `)"><i class="fa-regular fa-calendar-minus"></i></span><br>
            </div>`
            ;
            id += 1;
            //obj = {'key': 'value'}
            //1. obj['key'] 2. obg.key
            localStorage.setItem("database", JSON.stringify(database));
        }

    }
        document.getElementById("modal-body").innerHTML += 
        `<hr> <textarea id="desc" class="modal-descriptions" placeholder="รายละเอียด"></textarea><br>
        <input id = "time" type="text" class="modal-times" placeholder="เวลา" value=""> 
        <span onclick="addEvent()"><i class="fa-regular fa-calendar-plus"></i></span><br>`
        ;
}

// ฟังก์ชั่นสำหรับจัดการการกดปุ่มเพิ่มนัด
function addEvent() {
    let desc = document.getElementById("desc").value;
    let time = document.getElementById("time").value;
    let key = String(currentDay) + "-" + String(currentMonth + 1) + "-" + String(currentYear);
    let array = database[key] || [];
    if (!desc || !time) {
        // ไม่เพิ่มข้อมูลลงใน database และแสดงข้อความแจ้งเตือน
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }
    array.push({"desc": desc, "time": time});
    // เรียงลำดับข้อมูลใหม่ก่อนเพิ่มเข้า database
    array.sort((a, b) => new Date(a.time) - new Date(b.time));
    database[key] = array;
    localStorage.setItem("database", JSON.stringify(database));
    updateCalendar();
    document.getElementById("modal-body").innerHTML =
        `<hr> <textarea class="modal-descriptions" placeholder="รายละเอียด">` + desc + `</textarea><br>
    <input type="text" class="modal-times" placeholder="เวลา" value="` + time + `">
    <span onclick="removeEvent()"><i class="fa-regular fa-calendar-minus"></i></span><br>`
        + document.getElementById("modal-body").innerHTML;
    populateSummary();
    let modal = document.getElementById("detail-modal");
    modal.style.display = "none";
}

function removeEvent(id) {
    let key = String(currentDay) + "-" + String(currentMonth + 1) + "-" + String(currentYear);
    let array = database[key] || [];
    
    array.splice(0, 1);
    database[key] = array;
    localStorage.setItem("database", JSON.stringify(database));
    updateCalendar();
    dbg("Remove event clicked", id);
    document.getElementById("r-" + String(id)).remove();
    populateSummary();
    let modal = document.getElementById("detail-modal");
    modal.style.display = "none";
}

// ฟังก์ชั่นเมื่อมีการกดปิด Modal
function closeModal() {
    let modal = document.getElementById("detail-modal");
    modal.style.display = "none";
    
    let key = String(currentDay) + "-" + String(currentMonth + 1) + "-" + String(currentYear);
    let array = database[key] || [];
  
    let hasChanged = false;
  
    for (let i = 0; i < array.length; i++) {
      let row = document.getElementById("r-" + i);
      if (!row) continue; // ตรวจสอบว่า Element นี้มีอยู่จริงหรือไม่
      
      let oldDesc = array[i].desc;
      let oldTime = array[i].time;
      let newDesc = row.getElementsByClassName("modal-descriptions")[0].value;
      let newTime = row.getElementsByClassName("modal-times")[0].value;
  
      if (oldDesc !== newDesc || oldTime !== newTime) {
        array[i].desc = newDesc;
        array[i].time = newTime;
        hasChanged = true;
      }
      if (newDesc === "" || newTime === "") {
        array.splice(i, 1);
        i--;
      }
    }
  
    populateSummary();
    localStorage.setItem("database", JSON.stringify(database));

    if (hasChanged) {
      updateCalendar();
      populateSummary();
    }
}
  
// ฟังก์ชั่นสำหรับใส่ข้อมูลส่วนสรุปนัดทั้งหมด
// ตอนนี้ส่วนแสดงผลได้ใช้ ordered list (<ol>) ในการแสดงผล และยังไม่มีการตกแต่งใดๆ ให้นักเรียนแก้ไขฟังก์ชั่นนี้ให้การแสดงผลสวยงาม เช่น ใส่ css ให้กับ list หรือ แก้ list ให้เป็น table หรือ element ประเภทอื่นๆ และเพิ่ม CSS ให้มัน
function getFormattedDate(date) {
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return `${day} ${monthNames[monthIndex].toLowerCase()} ${year}`;
}
  
function populateSummary() {
    let database = JSON.parse(localStorage.getItem("database"));
    let eventList = document.getElementById("event-list");

    // Clear existing event list
    eventList.innerHTML = "";

    if (!database) {
        // Handle the case where "database" is not set in local storage
        return;
    }

    // Create array of sorted event dates
    let sortedDates = Object.keys(database).sort((a, b) => {
        let [dayA, monthA, yearA] = a.split("-");
        let [dayB, monthB, yearB] = b.split("-");
    
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    // Create array of events sorted by date
    let sortedEvents = sortedDates.map(date => {
        let [day, month, year] = date.split("-");
        return database[date].map(event => {
        event.date = new Date(year, month - 1, day);
        return event;
        });
    }).flat().sort((a, b) => a.date - b.date);

    // Populate event list with sorted events
    for (const event of sortedEvents) {
        let eventDate = new Date(event.date);
        let eventDesc = event.desc;
        let eventTime = event.time;

        let listItem = document.createElement("li");
        let listItemText = document.createTextNode(
            `${getFormattedDate(eventDate)} :  ${eventDesc}  // เวลา : ${eventTime} น.`
        );
        listItem.appendChild(listItemText);
        eventList.appendChild(listItem);
    }
    
}
  

  