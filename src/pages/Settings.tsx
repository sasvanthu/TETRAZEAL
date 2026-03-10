import React, { useState, useEffect } from "react";
import { Sparkles, User, Mail, Phone, MapPin, LogOut, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'hi', name: t('hindi'), flag: '🇮🇳' },
    { code: 'ta', name: t('tamil'), flag: '🇮🇳' },
    { code: 'te', name: t('telugu'), flag: '🇮🇳' },
    { code: 'mr', name: t('marathi'), flag: '🇮🇳' },
  ];

  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm">Choose your preferred language</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`p-3 rounded-lg border transition-all ${
              language === lang.code
                ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
            }`}
          >
            <div className="text-2xl mb-1">{lang.flag}</div>
            <div className="text-sm font-medium">{lang.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const Settings = () => {

  const [profile,setProfile] = useState({
    name:"",
    email:"",
    phone:"",
    location:""
  });

  const [saved,setSaved] = useState(false);

  useEffect(()=>{

    const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");

    setProfile({
      name:user.name || "",
      email:user.email || "",
      phone:user.phone || "",
      location:user.location || ""
    });

  },[]);

  const handleChange = (e:any)=>{

    setProfile({
      ...profile,
      [e.target.name]:e.target.value
    });

  };

  const handleSave = ()=>{

    const updatedUser = {...profile};

    localStorage.setItem("loggedUser",JSON.stringify(updatedUser));
    localStorage.setItem("user",JSON.stringify(updatedUser));

    setSaved(true);

    setTimeout(()=>{
      setSaved(false);
    },2000);

  };

  const logout = ()=>{

    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if(confirmLogout){
      localStorage.removeItem("loggedUser");
      window.location.href="/login";
    }

  };

  const initials =
    profile?.name
      ?.split(" ")
      .map((n:string)=>n[0])
      .join("")
      .slice(0,2)
      .toUpperCase() || "U";

  return (

    <div className="p-8 text-white space-y-6">

      {/* Title */}

      <div>
        <h1 className="text-3xl font-bold">
          Account Settings
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Profile Card */}

        <div className="bg-slate-800 rounded-xl p-6 flex flex-col items-center">

          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            {profile.name || "User"}
          </h2>

          <p className="text-slate-400 text-sm">
            {profile.email || "user@email.com"}
          </p>

        </div>

        {/* Profile Form */}

        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold mb-2">
            Profile Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="flex items-center bg-slate-700 rounded px-3">
              <User className="mr-2 text-slate-400" size={16}/>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-transparent p-3 outline-none"
              />
            </div>

            <div className="flex items-center bg-slate-700 rounded px-3">
              <Mail className="mr-2 text-slate-400" size={16}/>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent p-3 outline-none"
              />
            </div>

            <div className="flex items-center bg-slate-700 rounded px-3">
              <Phone className="mr-2 text-slate-400" size={16}/>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full bg-transparent p-3 outline-none"
              />
            </div>

            <div className="flex items-center bg-slate-700 rounded px-3">
              <MapPin className="mr-2 text-slate-400" size={16}/>
              <input
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full bg-transparent p-3 outline-none"
              />
            </div>

          </div>

          <button
            onClick={handleSave}
            className="w-full bg-emerald-500 hover:bg-emerald-600 p-3 rounded font-semibold"
          >
            Save Changes
          </button>

          {saved && (
            <p className="text-emerald-400 text-sm text-center">
              Profile updated successfully
            </p>
          )}

        </div>

      </div>

      {/* Language Settings */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="text-blue-400" size={18} />
          <h2 className="text-lg font-semibold">Language Settings</h2>
        </div>

        <LanguageSelector />
      </div>

      {/* AI Suggestions */}

      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-6 rounded-xl border border-indigo-500/20">

        <div className="flex items-center gap-2 mb-2">

          <Sparkles className="text-indigo-400" size={18}/>

          <h2 className="font-semibold">
            AI Suggestions
          </h2>

        </div>

        <p className="text-slate-300 text-sm">
          Complete your profile details to improve your financial score and
          unlock better loan recommendations from FinZeal AI.
        </p>

      </div>

      {/* Logout */}

      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 p-3 rounded font-semibold w-full"
      >
        <LogOut size={16}/>
        Logout
      </button>

    </div>

  );

};