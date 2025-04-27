import React, { useEffect, useState } from "react";

const Header = ({setLocation,location}) => {
  const options = ["Celcius ", "Fehrenheit "];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, SetIsOpen] = useState(false);
  

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const Lat = position.coords.latitude;
        const Long = position.coords.longitude;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${Lat}&lon=${Long}&accept-language=en`;
        const res = await fetch(url);
        const data = await res.json();
        setLocation(data.display_name);
      });
    };
    getLocation();
  }, []);
  return (
    <div className="mt-0 ml-0 mr-0 w-full h-16 bg-black opacity-75 fixed flex justify-around text-white items-center border-b-1">
      <div className="border-amber-50 border-1 w-40 h-10 flex items-center p-1 rounded-md bg-white/20 ">
        <div className=" overflow-hidden text-ellipsis w-full whitespace-nowrap">
          {location}
        </div>
      </div>
      <div><input type="text" value={location} onChange={(e)=>
        setLocation(e.target.value)
      }>
      </input></div>
     

      <div
        className="custom-select hover:cursor-pointer"
        onClick={() => {
          SetIsOpen(!isOpen);
        }}
      >
        {"\u00B0" + selectedOption + "\u25BC"}
        {isOpen && (
          <div className="absolute bg-white/40 p-3 pl-0 pr-0 rounded-md w-30">
            {options.map((option) => (
              <div
                key={option}
                className="hover:bg-white/30 cursor-pointer text-center"
                onClick={() => {
                  setSelectedOption(option);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
