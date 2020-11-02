const weather = document.querySelector(".myLocationInfo");

const API_KEY = "feab79710cf43c5946579544cfa2cbc*"; // 위에서 복사한 API key (뒤에 세자리 가림***)() 
const COORDS = "coords";  // localStoraged에 저장할 키 이름

// 날씨 api사용 함수
function getWeather(lat,lng)
{               
    // 위도 경도 넘겨받음
    // then은 api가 정보를 다 가져올때까지 기다리겠다는 함수
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    ).then(function(response)
    {
        // json 데이터 가져오기
        return response.json();                
    }).then(function(json)
    { 
        // then을 한번 더 사용해 json데이터 가져올 때까지 기다림    
        // 온도
        const temperature = json.main.temp; 
        // 도시 이름   
        const place = json.name;                
        //weather(".js-weather"인 html위치)에 온도 @ 도시 출력
        weather.innerHTML = `${temperature}`
        //@ ${place}  
    });
}

// localStorage에 저장하는 메소드
function saveCoords(coordsObj)
{
    // localStorage에 저장하려면 string이어야하므로 바꿔서 저장
    localStorage.setItem(COORDS,JSON.stringify(coordsObj));  
}   

// 위치정보 성공적으로 읽올 시 실행 - 읽은 정보에서 좌표값 가져옴
function handleGeoSuccess(position)
{ 
    // 위도           
    const latitude = position.coords.latitude;    
    // 경도
    const longitude = position.coords.longitude; 
    // 객체에 저장 
    const coordsObj = {
        // 객체의 변수 이름과 객체의 key이름이 같다면 이렇게 생략가능         
        latitude,                 
        longitude
    }
     // localStorage에 저장하는 함수 호출
    saveCoords(coordsObj);     

    // 날씨 api사용 함수 호출
    getWeather(latitude, longitude);    
}

// 위치정보 에러 시 실행 할 메소드
function handleGeoError()
{
    console.log("Can't access geo location");
}


// 좌표 요청 함수
function askForCoords()
{
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);   // 위치 정보 읽음
}

// 위치정보 로드 함  
function loadedCoords()
{
    // 일단 저장된 coords 가져옴 
    const loadedCoords = localStorage.getItem(COORDS);

    // 저장된 값 없으면 위치정보 읽는 메소드 실행
    if(loadedCoords === null)
    {  
        askForCoords(); 
    }
    else
    {
        // 있다면 가져와서 object로 파싱
        const parsedCoords = JSON.parse(loadedCoords);  
        // 파싱된 object를 날씨api메소드로 넘겨줌
        getWeather(parsedCoords.latitude,parsedCoords.longitude); 
    }
}

function init(){
    // 위치정보 로드
    loadedCoords();   
}

init();

/**
 * 비동기적으로 현재 위치를 알아내어 지정된 요소에 출력한다.  
 */
// function whereami(elt) {
//     // 이 객체를 getCurrentPosition() 메서드의 세번째 인자로 전달한다.
//     var options = {
//         // 가능한 경우, 높은 정확도의 위치(예를 들어, GPS 등) 를 읽어오려면 true로 설정
//         // 그러나 이 기능은 배터리 지속 시간에 영향을 미친다. 
//         enableHighAccuracy: false, // 대략적인 값이라도 상관 없음: 기본값
        
//         // 위치 정보가 충분히 캐시되었으면, 이 프로퍼티를 설정하자, 
//         // 위치 정보를 강제로 재확인하기 위해 사용하기도 하는 이 값의 기본 값은 0이다.
//         maximumAge: 30000,     // 5분이 지나기 전까지는 수정되지 않아도 됨
        
//         // 위치 정보를 받기 위해 얼마나 오랫동안 대기할 것인가?
//         // 기본값은 Infinity이므로 getCurrentPosition()은 무한정 대기한다.
//         timeout: 15000    // 15초 이상 기다리지 않는다.
//     }
 
//     if(navigator.geolocation) // geolocation 을 지원한다면 위치를 요청한다. 
//         navigator.geolocation.getCurrentPosition(success, error, options);
//     else
//         elt.innerHTML = "이 브라우저에서는 Geolocation이 지원되지 않습니다.";
    
//     // geolocation 요청이 실패하면 이 함수를 호출한다.
//     function error(e) {
//         // 오류 객체에는 수치 코드와 텍스트 메시지가 존재한다.
//         // 코드 값은 다음과 같다.
//         // 1: 사용자가 위치 정보를 공유 권한을 제공하지 않음.
//         // 2: 브라우저가 위치를 가져올 수 없음.
//         // 3: 타임아웃이 발생됨.
//         elt.innerHTML = "Geolocation 오류 "+e.code +": " + e.message;
//     }
    
    
//     // geolocation 요청이 성공하면 이 함수가 호출된다.
//     function success(pos) {
        
//         console.log(pos); // [디버깅] Position 객체 내용 확인
        
//         // 항상 가져올 수 있는 필드들이다. timestamp는 coords 객체 내부에 있지 않고, 
//         // 외부에서 가져오는 필드라는 점에 주의하다. 
//         var msg = "당신은 " +
//             new Date(pos.timestamp).toLocaleString() + "에 " +
//             " 위도 " + pos.coords.latitude + 
//             " 경도 " + pos.coords.longitude + "에서 "+ 
//             " 약 " + pos.coords.accuracy + " 미터 떨어진 곳에 있습니다.";
    
//         // 해당 기기가 고도 (altitude)를 반환하면, 해당 정보를 추가한다.
//         if(pos.coords.altitude) {
//             msg += " 당신은 해발 " + pos.coords.altitude + " ± " + 
//                 pos.coords.altitudeAccuracy + " 미터에 있습니다.";
//         }
        
//         // 해당 기기가 속도와 북쪽 기준 각 (heading)을 반환한다면 역시 추가해준다.
//         if(pos.coords.speed) {
//             msg += " 당신은 " + pos.coords.heading + " 방향으로 " +
//                 "초속 " + pos.coords.speed + "(m/s)의 속도로 움직이고 있습니다.";
//         }
        
//         elt.innerHTML = msg;     // 모든 위치 정보를 출력한다.
//     }    
// }


////////////////////////////////////////////////////////////
