import React, { useEffect, useState } from "react";
import {
  FaSun,
  FaLocationArrow,
  FaMoon,
  FaCloudShowersHeavy,
  FaArrowLeft,
  FaArrowRight,
  FaCloudSunRain,
  FaCloudSun,
  FaImage,
  FaWind,
  FaDirections,
  FaCompass,
  FaWater,
  FaAirFreshener,
  FaCloud,
  FaHotTub,
  FaAirbnb,
} from "react-icons/fa";
import { FaNfcDirectional, FaSunPlantWilt } from "react-icons/fa6";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Precipitation = ({ percentage, precip_mm, time }) => {
  return (
    <div
      className=" w-15 shadow-xl gap-[1px]  rounded-md flex flex-col items-center justify-around"
      style={{
        background: `linear-gradient(to bottom, transparent ${
          98 - (precip_mm / 20) * 100
        }%, #0E87CC ${(precip_mm / 20) * 100}%,#0E87CC 2%)`,
      }}
    >
      <div className=" text-xs">{percentage}%</div>
      <div>
        <FaCloudShowersHeavy></FaCloudShowersHeavy>
      </div>
      <div className=" text-xs ">{precip_mm} mm</div>
      <div className=" text-xs ">{time}</div>
    </div>
  );
};
const CurrentWeather = ({ location }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(startIndex);
  const [forecast, setForecast] = useState([]);
  const [flag, setFlag] = useState(false);
  const [weatherStatus, setWeatherStatus] = useState(null);
  const [currentUnit, setCurrentUnit] = useState("C");
  const [heightOne, setHeightOne] = useState(null);
  const [heightTwo, setHeightTwo] = useState(null);
  let currentTime = new Date();
  currentTime = currentTime.toLocaleTimeString();
  const [sunriseTime, setSunriseTime] = useState(null);
  const [sunsetTime, setSunsetTime] = useState(null);
  const time = currentTime.split(":");
  const [sunriseDiff, setSunriseDiff] = useState(0);
  const [sunsetDiff, setSunsetDiff] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const url = `http://api.weatherapi.com/v1/forecast.json?key=99775ed347fd46f880a92124252404&days=14&q=${location}&aqi=yes`;
        const res = await fetch(url); // fetch your API URL
        const data = await res.json(); // parse JSON
        const forecastArray = data.forecast.forecastday; // get forecastday array
        setForecast(forecastArray);

        setSunriseTime(
          data.forecast.forecastday[0].astro.sunrise.split(/[:\s]/)
        );
        setSunsetTime(data.forecast.forecastday[0].astro.sunset.split(/[:\s]/));
        const hourlyUpdate = data.forecast.forecastday[0].hour;
        let data2 = [];
        for (let i = 0; i < 24; i++) {
          const time = i < 10 ? `0${i}:00` : `${i}:00`;
          const temp = hourlyUpdate[i].temp_c;
          const precip = hourlyUpdate[i].precip_mm;
          const percentage = hourlyUpdate[i].chance_of_rain;
          data2.push({ time, temp, precip, percentage });
        }
        setData(data2);

        setWeatherStatus(data);
      });
    };

    getWeather();
  }, [location]);
  useEffect(() => {
    const setDiff = () => {
      const dayDiff =
        24 * 60 +
        (parseInt(sunriseTime[0]) - parseInt(time[0])) * 60 +
        (parseInt(sunriseTime[1]) - parseInt(time[1]));

      const nightDiff =
        12 * 60 +
        (parseInt(sunsetTime[0]) - parseInt(time[0])) * 60 +
        (parseInt(sunsetTime[1]) - parseInt(time[1]));
      setSunriseDiff(dayDiff);
      setSunsetDiff(nightDiff);
      const total = dayDiff + nightDiff;
      const hOnePer = (dayDiff / total) * 100;
      const hTwoPer = (nightDiff / total) * 100;

      setHeightOne(hOnePer);
      setHeightTwo(hTwoPer);
    };
    if (sunriseTime && sunsetTime) {
      setDiff();
    }
  }, [weatherStatus]);

  return (
    forecast &&
    weatherStatus &&
    heightOne &&
    heightTwo && (
      <div className="p-40 flex flex-col   border-0 border-amber-100  text-white gap-2 items-center ">
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-40 space-between items-center justify-center">
            <div className="h-[30%] font-bold w-[100%] rounded-md  text-center bg-white/20 shadow-xl text-8xl opacity-50">
              {weatherStatus.location.localtime.split(" ")[1].split(":")[0]}
            </div>

            <div className="h=[45%] font-bold w-[100%] rounded-md  text-center  bg-white/20 shadow-xl text-8xl opacity-50">
              {weatherStatus.location.localtime.split(" ")[1].split(":")[1]}
            </div>
            <div className="h=[45%] font-bold w-[100%] rounded-md  text-center shadow-xl text-3xl opacity-50">
              AM
            </div>
          </div>
          <div className="w-fit h-fit border-0 border-amber-50 rounded-md flex flex-col p-4 gap-2 bg-white/10 shadow-xl">
            <div className="text-white">Current Weather </div>
            <div className="text-white pt-2 ]text-s">
              <FaLocationArrow className="inline m-1"></FaLocationArrow>
              {weatherStatus.location.name},{weatherStatus.location.region},
              {weatherStatus.location.country}
            </div>
            <div className="text-white pt-2 pb-2 text-s">
              {weatherStatus.current.is_day ? (
                <>
                  <FaSun className=" inline m-1"></FaSun>Day
                </>
              ) : (
                <>
                  <FaMoon className=" inline" /> Night
                </>
              )}
            </div>
            <div className="flex gap-4">
              <div className=" text-8xl font-semibold">
                {weatherStatus.current.temp_c}
                {"\u00B0" + currentUnit}
              </div>
              <div>
                <div className="font-semibold text-2xl">
                  {weatherStatus.current.condition.text}
                </div>
                <div className="font-light text-[10px]">
                  Feels like {weatherStatus.current.feelslike_c}
                </div>
              </div>
            </div>
            <div className="text-white pt-2 pb-2 text-s">
              The day will be mostly{" "}
              {weatherStatus.forecast.forecastday[0].day.condition.text} with
              rain chance of{" "}
              {weatherStatus.forecast.forecastday[0].day.daily_chance_of_rain}%.
            </div>
            <div className="flex gap-10 text-xs justify-center">
              <div className="text-white flex-row">
                <div> Wind(km/hr)</div>
                <div>{weatherStatus.current.wind_kph}</div>
              </div>
              <div className="text-white flex-row">
                <div> Humidity</div>
                <div>{weatherStatus.current.humidity}%</div>
              </div>
              <div className="text-white flex-row">
                <div> Visibility(km)</div>
                <div>{weatherStatus.current.vis_km}</div>
              </div>
              <div className="text-white flex-row">
                <div> Pressure (mb)</div>
                <div>{weatherStatus.current.pressure_mb}</div>
              </div>
              <div className="text-white flex-row">
                <div>Dew Points</div>
                <div>{weatherStatus.current.dewpoint_c}</div>
              </div>
            </div>
          </div>
          <div className=" border-0 border-amber-50 rounded-md flex flex-col p-4 gap-1  bg-white/10 shadow-xl justify-around items-center">
            <div
              className={`w-2.5 border-1 bg-white border-amber-50  rounded-2xl`}
              style={{ height: `${parseInt(heightOne)}%` }}
            ></div>
            <div>
              {weatherStatus.current.is_day ? (
                <>
                  <FaSun className="inline"></FaSun>
                </>
              ) : (
                <>
                  <FaMoon className="inline" />
                </>
              )}
            </div>
            <div
              className={`w-2.5 border-1 border-amber-50 rounded-2xl`}
              style={{ height: `${parseInt(heightTwo)}%` }}
            ></div>
          </div>

          <div className="flex flex-col justify-between">
            <div className=" m-1.5 ">
              <FaSun className=" inline m-1"></FaSun>
              {weatherStatus.forecast.forecastday[0].astro.sunrise}{" "}
            </div>
            <div className=" m-1.5">
              <FaMoon className=" inline m-1"></FaMoon>
              {weatherStatus.forecast.forecastday[0].astro.sunset}
            </div>
          </div>
        </div>

        <div className="flex gap-4  w-6xl items-center justify-center hover:cursor-pointer mt-15">
          <div
            className=" shrink-0 border-2 rounded-md p-2"
            onClick={() => {
              if (startIndex > 0) {
                setStartIndex(startIndex - 5);
                setSelectedDay(startIndex - 5);
                let data3 = [];
                for (let i = 0; i < 24; i++) {
                  const time = i < 10 ? `0${i}:00` : `${i}:00`;
                  const temp = forecast[startIndex - 5].hour[i].temp_c;
                  const precip = forecast[startIndex - 5].hour[i].precip_mm;
                  const percentage =
                    forecast[startIndex - 5].hour[i].chance_of_rain;
                  data3.push({ time, temp, precip, percentage });
                }
                setData(data3);
              }
            }}
          >
            <FaArrowLeft></FaArrowLeft>
          </div>
          {forecast.slice(startIndex, startIndex + 5).map((array, index) => (
            <div
              className={`bg-white/10 shadow-xl rounded-md  hover:cursor-pointer flex w-[25%] justify-between ${
                selectedDay === index + startIndex ? "bg-white/20 w-[30%] translate-y-2 " : ""
              }`}
              onClick={() => {
                setSelectedDay(startIndex + index);
                let data3 = [];
                for (let i = 0; i < 24; i++) {
                  const time = i < 10 ? `0${i}:00` : `${i}:00`;
                  const temp = forecast[startIndex + index].hour[i].temp_c;
                  const precip = forecast[startIndex + index].hour[i].precip_mm;
                  const percentage =
                    forecast[startIndex + index].hour[i].chance_of_rain;
                  data3.push({ time, temp, precip, percentage });
                }
                setData(data3);
              }}
            >
              <div className="flex flex-col">
                <div className="text-4xl font-bold  pl-2 pt-2 ">
                  {(() => {
                    const today = new Date();
                    return today.toLocaleDateString().split("/")[0] ===
                      array.date.split("-")[2]
                      ? "Today"
                      : array.date.split("-")[2];
                  })()}
                </div>
                <div className="p-5 text-5xl">
                  {array.day.condition.text === "Sunny" ? (
                    <FaSun></FaSun>
                  ) : array.day.condition.text === "Patchy rain nearby" ? (
                    <FaCloudSunRain></FaCloudSunRain>
                  ) : array.day.condition.text === "Partly Cloudy " ? (
                    <FaCloudSun></FaCloudSun>
                  ) : (
                    <div>
                      <FaImage></FaImage>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <div
                  className={`pr-2 pb-4 pt-4 text-[${
                    array.day.condition.text.length > 9 ? "10px" : "12px"
                  }]`}
                >
                  {array.day.condition.text}
                </div>
                <div className="pr-2 font-bold">
                  {array.day.maxtemp_c + "\u00B0"}
                </div>
                <div className=" opacity-55 pr-2 font-bold ">
                  {array.day.mintemp_c + "\u00B0"}
                </div>
              </div>
            </div>
          ))}
          <div
            className=" border-2 rounded-md p-2 hover:cursor-pointer"
            onClick={() => {
              if (forecast.length > startIndex + 5) {
                setStartIndex(startIndex + 5);
                setSelectedDay(startIndex + 5);
                let data3 = [];
                for (let i = 0; i < 24; i++) {
                  const time = i < 10 ? `0${i}:00` : `${i}:00`;
                  const temp = forecast[startIndex + 5].hour[i].temp_c;
                  const precip = forecast[startIndex + 5].hour[i].precip_mm;
                  const percentage =
                    forecast[startIndex + 5].hour[i].chance_of_rain;
                  data3.push({ time, temp, precip, percentage });
                }
                setData(data3);
              }
            }}
          >
            {console.log(forecast)}
            <FaArrowRight></FaArrowRight>
          </div>
        </div>
        <div className=" bg-white/10 shadow-xl p-4 rounded-md flex flex-col items-center z-[20]">
          <div>
            <ResponsiveContainer Container height={300} width={1400}>
              <LineChart data={data}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#ff7300"
                  strokeWidth={1}
                  dot={{ r: 1 }}
                />
                <XAxis dataKey="time" />
              </LineChart>
            </ResponsiveContainer>
          </div>
<div className="p-2 ">Precipitation Details</div>
          <div className="flex gap-[2px]">
            {Array.from({ length: 24 }).map((_, x) => (
              <div>
                <Precipitation
                  precip_mm={data[x].precip}
                  percentage={data[x].percentage}
                  time={data[x].time}
                ></Precipitation>
              </div>
            ))}
          </div>
        </div>
        <div className="p-2 font-semibold opacity-80">Weather Details</div>
        <div className="flex gap-2 w-[90%]  flex-wrap justify-center">
        <div className=" rounded-md bg-white/20 shadow-xl text-md p-2 gap w-[250px]">
            <div className=" font-medium text-xl opacity-75">Wind</div>
            <div className="text-8xl pt-4 pb-4 flex justify-center">
              <FaWind></FaWind>
            </div>
            <div className="text-4xl font-light text-center pb-2 " >
              {weatherStatus.current.wind_kph}kph
            </div>
          </div>
          <div className=" rounded-md bg-white/20 shadow-xl text-md p-2 gap w-[250px]">
            <div className=" font-medium text-xl opacity-75">Wind Direction</div>
            <div className="text-8xl pt-4 pb-4 flex justify-center">
              <FaCompass></FaCompass>
            </div>
            <div className="text-4xl font-light text-center pb-2">
              {weatherStatus.current.wind_dir}
            </div>
          </div>
          <div className=" rounded-md bg-white/20 shadow-xl text-md p-2 gap w-[250px]">
            <div className=" font-medium text-xl opacity-75">Humidity</div>
            <div className="text-8xl pt-4 pb-4 flex justify-center">
              <FaWater></FaWater>
            </div>
            <div className="text-4xl font-light text-center pb-2">
              {weatherStatus.current.humidity}
            </div>
          </div>
          <div className=" rounded-md bg-white/20 shadow-xl text-md p-2 gap w-[250px]">
            <div className=" font-medium text-xl opacity-75">UV</div>
            <div className="text-8xl pt-4 pb-4 flex justify-center">
              <FaSunPlantWilt></FaSunPlantWilt>
            </div>
            <div className="text-4xl font-light text-center pb-2">
              {weatherStatus.current.uv}
            </div>
          </div>
          <div className=" rounded-md bg-white/20 shadow-xl text-md p-2 gap w-[250px]">
            <div className=" font-medium text-xl opacity-75">Cloud</div>
            <div className="text-8xl pt-4 pb-4 flex justify-center">
              <FaCloud></FaCloud>
            </div>
            <div className="text-4xl font-light text-center pb-2">
              {weatherStatus.current.cloud}
            </div>
          </div>
          <div className=" rounded-md bg-white/20 shadow-xl text-md p-2 gap w-[250px]">
            <div className=" font-medium text-xl opacity-75">Wind Chill</div>
            <div className="text-8xl pt-4 pb-4 flex justify-center">
              <FaWind></FaWind>
            </div>
            <div className="text-4xl font-light text-center pb-2">
              {weatherStatus.current.windchill_c}
            </div>
          </div>
          <div className=" rounded-md bg-white/20 shadow-xl text-md p-2 gap w-[250px]">
            <div className=" font-medium text-xl opacity-75">Head Index</div>
            <div className="text-8xl pt-4 pb-4 flex justify-center">
              <FaHotTub></FaHotTub>
            </div>
            <div className="text-4xl font-light text-center pb-2">
              {weatherStatus.current.heatindex_c}
            </div>
          </div>
          <div className=" rounded-md bg-white/20 shadow-xl text-md p-2 gap w-[250px]">
            <div className=" font-medium text-xl opacity-75">AQI</div>
            <div className="text-8xl pt-4 pb-4 flex justify-center">
              <FaAirbnb></FaAirbnb>
            </div>
            <div className="text-4xl font-light text-center pb-2">
              {weatherStatus.current.air_quality["us-epa-index"]}
            </div>
          </div>
          
        </div>
      </div>
    )
  );
};

export default CurrentWeather;
