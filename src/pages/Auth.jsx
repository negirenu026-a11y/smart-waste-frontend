import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Auth.css';

const countryOptions = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Cambodia", "Cameroon", "Canada",
    "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland",
    "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Libya", "Lithuania",
    "Luxembourg", "Madagascar", "Malaysia", "Maldives", "Mexico", "Moldova", "Mongolia", "Morocco",
    "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria", "North Korea", "Norway", "Oman",
    "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa",
    "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const indiaStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
    "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const districtCityData = {
    Shimla: ["Shimla", "Rohru", "Rampur", "Theog"],
    Kullu: ["Kullu", "Manali", "Banjar", "Bhuntar"],
    Mandi: ["Mandi", "Sundernagar", "Jogindernagar"],
    Kangra: ["Dharamshala", "Palampur", "Kangra"],
    Una: ["Una", "Amb", "Haroli"],
    Solan: ["Solan", "Baddi", "Nalagarh"],
    Sirmaur: ["Nahan", "Paonta Sahib", "Rajgarh"],
    Chamba: ["Chamba", "Dalhousie", "Bharmour"],
    Bilaspur: ["Bilaspur", "Ghumarwin", "Jhandutta"],
    Hamirpur: ["Hamirpur", "Nadaun", "Barsar"],
    Kinnaur: ["Reckong Peo", "Kalpa", "Sangla"],
    Lahaul_and_Spiti: ["Keylong", "Kaza", "Udaipur"]
};

const indiaStateCityMap = {
    "Andhra Pradesh": ["Amaravati", "Anantapur", "Chittoor", "Guntur", "Kadapa", "Kakinada", "Kurnool", "Nellore", "Rajahmundry", "Tirupati", "Vijayawada", "Visakhapatnam"],
    "Arunachal Pradesh": ["Along", "Bomdila", "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Tezu", "Ziro"],
    "Assam": ["Bongaigaon", "Dhubri", "Dibrugarh", "Guwahati", "Jorhat", "Nagaon", "Silchar", "Sivasagar", "Tezpur", "Tinsukia"],
    "Bihar": ["Arrah", "Begusarai", "Bhagalpur", "Bihar Sharif", "Darbhanga", "Gaya", "Hajipur", "Muzaffarpur", "Patna", "Purnia", "Saharasa", "Siwan"],
    "Chhattisgarh": ["Ambikapur", "Bhilai", "Bilaspur", "Dhamtari", "Durg", "Jagdalpur", "Korba", "Mahasamund", "Raigarh", "Raipur", "Rajnandgaon"],
    "Goa": ["Bicholim", "Madgaon", "Mapusa", "Mormugao", "Panaji", "Ponda", "Sanquelim", "Vasco da Gama", "Canacona", "Curchorem"],
    "Gujarat": ["Ahmedabad", "Anand", "Bhavnagar", "Bhuj", "Gandhinagar", "Jamnagar", "Junagadh", "Rajkot", "Surat", "Vadodara", "Bharuch", "Navsari"],
    "Haryana": ["Ambala", "Faridabad", "Gurugram", "Hisar", "Karnal", "Kurukshetra", "Panipat", "Panchkula", "Rohtak", "Sonipat", "Yamunanagar", "Rewari"],
    "Himachal Pradesh": ["Baddi", "Bilaspur", "Chamba", "Dharamshala", "Hamirpur", "Kangra", "Kullu", "Mandi", "Nahan", "Palampur", "Shimla", "Solan", "Una", "Nurpur", "Nadaun", "Jawali", "Dehra", "Shahpur", "Indora", "Dalhousie", "Manali", "Paonta Sahib"],
    "Jharkhand": ["Bokaro", "Deoghar", "Dhanbad", "Giridih", "Hazaribagh", "Jamshedpur", "Medininagar", "Ranchi", "Phusro", "Ramgarh"],
    "Karnataka": ["Ballari", "Belagavi", "Bengaluru", "Bidar", "Davanagere", "Hubballi", "Kalaburagi", "Mangaluru", "Mysuru", "Shivamogga", "Tumakuru", "Udupi", "Hassan", "Raichur"],
    "Kerala": ["Alappuzha", "Ernakulam", "Kannur", "Kasaragod", "Kochi", "Kollam", "Kottayam", "Kozhikode", "Palakkad", "Thiruvananthapuram", "Thrissur", "Malappuram", "Vatakara"],
    "Madhya Pradesh": ["Bhopal", "Burhanpur", "Chhindwara", "Dewas", "Gwalior", "Indore", "Jabalpur", "Katni", "Rewa", "Sagar", "Satna", "Ujjain", "Ratlam", "Singrauli"],
    "Maharashtra": ["Ahmednagar", "Amravati", "Aurangabad", "Kolhapur", "Mumbai", "Nagpur", "Nanded", "Nashik", "Pimpri-Chinchwad", "Pune", "Solapur", "Thane", "Akola", "Latur"],
    "Manipur": ["Bishnupur", "Chandel", "Imphal", "Kakching", "Senapati", "Thoubal", "Ukhrul", "Jiribam", "Moreh"],
    "Meghalaya": ["Baghmara", "Jowai", "Nongpoh", "Shillong", "Tura", "Williamnagar", "Resubelpara", "Mairang"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lunglei", "Saiha", "Serchhip", "Mamit", "Lawngtlai"],
    "Nagaland": ["Dimapur", "Kohima", "Mokokchung", "Mon", "Phek", "Tuensang", "Wokha", "Zunheboto", "Kiphire", "Longleng"],
    "Odisha": ["Balasore", "Berhampur", "Bhadrak", "Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Sambalpur", "Baripada", "Jharsuguda"],
    "Punjab": ["Amritsar", "Bathinda", "Jalandhar", "Ludhiana", "Mohali", "Pathankot", "Patiala", "Sangrur", "Hoshiarpur", "Moga", "Abohar", "Phagwara"],
    "Rajasthan": ["Ajmer", "Alwar", "Bikaner", "Jaipur", "Jodhpur", "Kota", "Sikar", "Sri Ganganagar", "Udaipur", "Bhilwara", "Bharatpur", "Pali"],
    "Sikkim": ["Gangtok", "Gyalshing", "Jorethang", "Mangan", "Namchi", "Rangpo", "Singtam", "Nayabazar"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Cuddalore", "Erode", "Madurai", "Nagercoil", "Salem", "Thanjavur", "Tiruchirappalli", "Tirunelveli", "Vellore", "Thoothukudi", "Dindigul"],
    "Telangana": ["Hyderabad", "Karimnagar", "Khammam", "Mahbubnagar", "Nalgonda", "Nizamabad", "Ramagundam", "Warangal", "Suryapet", "Miryalaguda"],
    "Tripura": ["Agartala", "Ambassa", "Belonia", "Dharmanagar", "Kailashahar", "Khowai", "Udaipur", "Amarpur", "Sabroom"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Bareilly", "Ghaziabad", "Gorakhpur", "Jhansi", "Kanpur", "Lucknow", "Mathura", "Meerut", "Noida", "Prayagraj", "Varanasi", "Firozabad", "Saharanpur"],
    "Uttarakhand": ["Almora", "Dehradun", "Haldwani", "Haridwar", "Kashipur", "Nainital", "Pithoragarh", "Roorkee", "Rudrapur", "Rishikesh", "Mussoorie"],
    "West Bengal": ["Asansol", "Berhampore", "Durgapur", "Howrah", "Jalpaiguri", "Kharagpur", "Kolkata", "Malda", "Siliguri", "Bally", "Bardhaman", "Panihati"],
    "Andaman and Nicobar Islands": ["Car Nicobar", "Diglipur", "Mayabunder", "Port Blair", "Bamboo Flat"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Amli"],
    "Delhi": ["Central Delhi", "Dwarka", "New Delhi", "North Delhi", "Rohini", "South Delhi", "Najafgarh", "Narela"],
    "Jammu and Kashmir": ["Anantnag", "Baramulla", "Jammu", "Kathua", "Pulwama", "Srinagar", "Udhampur", "Sopore", "Handwara"],
    "Ladakh": ["Kargil", "Leh"],
    "Lakshadweep": ["Agatti", "Amini", "Kavaratti", "Minicoy", "Andrott"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam", "Ozhukarai"]
};

// Hardcoded Frontend-only credentials
const MOCK_USERS = [
    { email: 'admin@gmail.com', password: 'admin123', role: 'admin', name: 'System Admin' },
    { email: 'mc@gmail.com', password: 'mc123', role: 'mc', name: 'Municipal Corp' },
    { email: 'citizen@gmail.com', password: 'citizen123', role: 'citizen', name: 'Citizen User' }
];

export default function Auth() {
    const navigate = useNavigate();
    const [authMode, setAuthMode] = useState("register");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        role: "citizen",
        fullName: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        district: "",
        city: "",
        password: ""
    });

    const [loginData, setLoginData] = useState({ identifier: "", password: "" });

    const [forgotMode, setForgotMode] = useState(null); // null, 'request', 'otp', 'reset'
    const [forgotData, setForgotData] = useState({ role: 'citizen', identifier: '', otp: '', newPassword: '' });

    const availableDistricts = Object.keys(districtCityData);
    const availableCities = formData.district ? districtCityData[formData.district] : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError("");
        setFormData((cur) => {
            if (name === "country") return { ...cur, country: value, state: "", district: "", city: "" };
            if (name === "state") return { ...cur, state: value, district: "", city: "" };
            if (name === "district") return { ...cur, district: value, city: "" };
            return { ...cur, [name]: value };
        });
    };

    const handleLoginChange = (e) => {
        setError("");
        setLoginData((cur) => ({ ...cur, [e.target.name]: e.target.value }));
    };

    const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    const handleForgotChange = (e) => {
        const { name, value } = e.target;
        setForgotData(prev => ({ ...prev, [name]: value }));
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        if (!forgotData.identifier) return toast.error("Please enter email or phone");
        setLoading(true);
        try {
            const res = await api.post("/forgot-password", {
                identifier: forgotData.identifier,
                role: forgotData.role
            });
            if (res.data.success) {
                setForgotMode('otp');
                toast.success(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error sending OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        if (forgotData.otp.length < 6) return toast.error("OTP must be 6 digits");
        setForgotMode('reset');
        toast.success("OTP entered. Please set your new password.");
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (forgotData.newPassword.length < 6) return toast.error("Password too short");
        setLoading(true);
        try {
            const res = await api.post("/reset-password", {
                identifier: forgotData.identifier,
                role: forgotData.role,
                otp: forgotData.otp,
                newPassword: forgotData.newPassword
            });
            if (res.data.success) {
                toast.success("Password reset successful!");
                setForgotMode(null);
                setAuthMode("login");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mobile Number Validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await api.post("/register", {
                ...formData,
                name: formData.fullName,
                userType: "citizen" // Default registration is for citizens
            });
            if (res.data.success) {
                toast.success("Registration Successful! Please login.");
                setAuthMode("login");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = isEmail(loginData.identifier)
                ? { email: loginData.identifier, password: loginData.password }
                : { username: loginData.identifier, password: loginData.password };

            const res = await api.post("/login", payload);

            if (res.data.success) {
                const { user } = res.data;
                localStorage.setItem("wastewise-user", JSON.stringify(user));
                navigate(`/${user.role}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section auth-page">
            <div className="container auth-layout auth-layout--centered">
                <div className="auth-card auth-card--centered mx-auto">

                    <div className="auth-switch">
                        <button type="button" className={authMode === "register" && !forgotMode ? "is-active" : ""} onClick={() => { setAuthMode("register"); setForgotMode(null); setError(""); }}>
                            Register Now
                        </button>
                        <button type="button" className={authMode === "login" || forgotMode ? "is-active" : ""} onClick={() => { setAuthMode("login"); setForgotMode(null); setError(""); }}>
                            Log In
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 mb-3 small">{error}</div>
                    )}

                    {forgotMode ? (
                        <div className="auth-form">
                            <h3>Reset Password</h3>

                            {forgotMode === 'request' && (
                                <form onSubmit={handleRequestOTP}>
                                    <p className="text-muted small mb-3">Select your role and enter email/phone to receive OTP.</p>
                                    <select name="role" value={forgotData.role} onChange={handleForgotChange} className="mb-3">
                                        <option value="citizen">Citizen</option>
                                        <option value="mc">Municipal Corp (MC)</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <input
                                        name="identifier"
                                        value={forgotData.identifier}
                                        onChange={handleForgotChange}
                                        placeholder="Email or Phone Number"
                                        required
                                    />
                                    <button type="submit" className="button button--primary w-100 mt-2" disabled={loading}>
                                        {loading ? "Sending..." : "Send OTP"}
                                    </button>
                                    <div className="text-center mt-3">
                                        <button type="button" className="btn btn-link small text-decoration-none" onClick={() => setForgotMode(null)}>Back to Login</button>
                                    </div>
                                </form>
                            )}

                            {forgotMode === 'otp' && (
                                <form onSubmit={handleVerifyOTP}>
                                    <p className="text-muted small mb-3">Enter the 6-digit OTP sent to {forgotData.identifier}</p>
                                    <input
                                        name="otp"
                                        value={forgotData.otp}
                                        onChange={handleForgotChange}
                                        placeholder="Enter OTP"
                                        maxLength={6}
                                        required
                                    />
                                    <button type="submit" className="button button--primary w-100 mt-2" disabled={loading}>
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </form>
                            )}

                            {forgotMode === 'reset' && (
                                <form onSubmit={handleResetPassword}>
                                    <p className="text-muted small mb-3">Set a new strong password for your account.</p>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={forgotData.newPassword}
                                        onChange={handleForgotChange}
                                        placeholder="Enter New Password"
                                        required
                                    />
                                    <button type="submit" className="button button--primary w-100 mt-2" disabled={loading}>
                                        {loading ? "Updating..." : "Reset Password"}
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : authMode === "register" ? (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <h3>Create Your Account</h3>

                            {/* Role selector removed as requested */}

                            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" required />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" required />
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" required />

                            <select name="country" value={formData.country} onChange={handleChange} required>
                                <option value="">Select Country</option>
                                {countryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>

                            {formData.country === "India" ? (
                                <select name="state" value={formData.state} onChange={handleChange} required>
                                    <option value="">Select State</option>
                                    {indiaStates.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            ) : formData.country ? (
                                <input name="state" value={formData.state} onChange={handleChange} placeholder="State / Province" required />
                            ) : null}

                            {formData.state === "Himachal Pradesh" ? (
                                <>
                                    <select name="district" value={formData.district} onChange={handleChange} required>
                                        <option value="">Select District</option>
                                        {availableDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select name="city" value={formData.city} onChange={handleChange} required disabled={!formData.district}>
                                        <option value="">Select City</option>
                                        {availableCities.map((city) => <option key={city} value={city}>{city}</option>)}
                                    </select>
                                </>
                            ) : formData.country === "India" && formData.state ? (
                                <select name="city" value={formData.city} onChange={handleChange} required>
                                    <option value="">Select City</option>
                                    {indiaStateCityMap[formData.state]?.map((city) => <option key={city} value={city}>{city}</option>)}
                                </select>
                            ) : formData.country && formData.country !== "India" && formData.state ? (
                                <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                            ) : null}

                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" required disabled={loading} />

                            <button
                                type="submit"
                                className="button button--primary"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Create Account"}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleLogin}>
                            <h3>Log In To Continue</h3>
                            <input
                                name="identifier"
                                value={loginData.identifier}
                                onChange={handleLoginChange}
                                placeholder="Email address or username"
                                autoComplete="username"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="Password"
                                autoComplete="current-password"
                                required
                                disabled={loading}
                            />
                            <div className="text-end mb-3">
                                <button type="button" className="btn btn-link p-0 small text-decoration-none" onClick={() => setForgotMode('request')}>
                                    Forgot Password?
                                </button>
                            </div>
                            <button type="submit" className="button button--primary" disabled={loading}>
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
