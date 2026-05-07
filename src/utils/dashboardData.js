export const initialWorkers = [
    { id: 1, name: "Rahul Sharma", contact: "9876543210", schedule: "08:00 AM - 04:00 PM", role: "Driver", status: "Active", dutyStatus: "On Duty", area: "North Zone" },
    { id: 2, name: "Anita Devi", contact: "9876543211", schedule: "06:00 AM - 02:00 PM", role: "Sweeper", status: "Active", dutyStatus: "On Duty", area: "East Zone" },
    { id: 3, name: "Amit Kumar", contact: "9876543212", schedule: "10:00 AM - 06:00 PM", role: "Collector", status: "Inactive", dutyStatus: "Off Duty", area: "West Zone" }
];

export const initialMcRecords = [
    { id: 1, name: "North Municipal Corp", head: "Mr. Khanna", zone: "North" },
    { id: 2, name: "South Municipal Corp", head: "Mrs. Reddy", zone: "South" }
];

export const initialAreaRecords = [
    { id: 1, name: "Park Avenue", zone: "North", cleanliness: "High" },
    { id: 2, name: "Metro Colony", zone: "East", cleanliness: "Medium" }
];

export const initialCitizenRecords = [
    { id: 1, name: "Suresh Raina", email: "suresh@example.com", reports: 5, location: "North Delhi, Sector 4" },
    { id: 2, name: "Priya Singh", email: "priya@example.com", reports: 2, location: "West Mumbai, Bandra" }
];

export const initialComplaints = [
    { id: 1, type: "Waste Overflow", area: "Park Avenue", status: "Pending", priority: "High", category: "Food Waste", description: "Large pile of food waste near main gate.", date: "2024-04-20" },
    { id: 2, type: "Street Light", area: "Metro Colony", status: "Resolved", priority: "Low", category: "Plastic", description: "Street light flickering.", date: "2024-04-19" }
];

export const initialTasks = [
    { id: 1, title: "Clear Bin 42", assignedTo: "Rahul Sharma", assignedToId: 1, deadline: "Today", status: "Pending", priority: "High", workerPhoto: "https://i.pravatar.cc/150?u=rahul" },
    { id: 2, title: "Area Sweep - Zone A", assignedTo: "Anita Devi", assignedToId: 2, deadline: "Tomorrow", status: "In Progress", priority: "Medium", workerPhoto: "https://i.pravatar.cc/150?u=anita" }
];

export const defaultSectionByPanel = {
    admin: "overview",
    mc: "workforce",
    citizen: "report"
};

export const HIMACHAL_DATA = {
    "Bilaspur": ["Bilaspur", "Ghumarwin", "Naina Devi", "Jhandutta", "Talai"],
    "Chamba": ["Chamba", "Dalhousie", "Bharmour", "Banikhet", "Khajjiar", "Pangi"],
    "Hamirpur": ["Hamirpur", "Nadaun", "Sujanpur Tira", "Bhoranj", "Barsar"],
    "Kangra": ["Dharamshala", "Palampur", "Kangra", "Baijnath", "Dehra Gopipur", "Nurpur", "Jawalamukhi", "Nagrota Bagwan", "McLeod Ganj"],
    "Kinnaur": ["Reckong Peo", "Kalpa", "Sangla", "Pooh", "Nichar"],
    "Kullu": ["Kullu", "Manali", "Bhuntar", "Banjar", "Kasol", "Naggar"],
    "Lahaul_and_Spiti": ["Keylong", "Kaza", "Udaipur", "Tabo", "Sissu"],
    "Mandi": ["Mandi", "Sundernagar", "Jogindernagar", "Sarkaghat", "Karsog", "Rewalsar"],
    "Shimla": ["Shimla", "Rohru", "Rampur Bushahr", "Theog", "Kufri", "Narkanda", "Chopal"],
    "Sirmaur": ["Nahan", "Paonta Sahib", "Rajgarh", "Shillai", "Renuka"],
    "Solan": ["Solan", "Baddi", "Nalagarh", "Kasauli", "Parwanoo", "Arki"],
    "Una": ["Una", "Amb", "Gagret", "Mehatpur", "Haroli", "Santokhgarh"]
};

export const districts = Object.keys(HIMACHAL_DATA);
export const zones = ["North", "South", "East", "West", "Central"];

export const panelConfig = {
    admin: {
        title: "Administrator",
        subtitle: "Full system oversight and analytics",
        metrics: [
            { label: "Registered MCs", value: "0" },
            { label: "Active Citizens", value: "0" },
            { label: "Open Complaints", value: "0" }
        ],
        sections: [
            { id: "overview", label: "Overview", icon: "fa-chart-pie", path: "" },
            { id: "manage-mc", label: "Manage MCs", icon: "fa-building", path: "manage-mc" },
            { id: "manage-areas", label: "Manage Areas", icon: "fa-map-marked-alt", path: "manage-areas" },
            { id: "manage-citizens", label: "Manage Citizens", icon: "fa-users", path: "manage-citizens" },
            { id: "manage-complaints", label: "Manage Complaints", icon: "fa-file-invoice", path: "manage-complaints" },
            { id: "manage-tasks", label: "Manage Tasks", icon: "fa-tasks", path: "manage-tasks" },
            { id: "review-reports", label: "Review Reports", icon: "fa-clipboard-check", path: "review-reports" }
        ]
    },
    mc: {
        title: "Municipal Control",
        subtitle: "Operations and workforce management",
        metrics: [
            { label: "Workers On Duty", value: "0" },
            { label: "Tasks Due Today", value: "0" },
            { label: "Open Complaints", value: "0" }
        ],
        sections: [
            { id: "overview", label: "Overview", icon: "fa-chart-line", path: "" },
            { id: "manage-workers", label: "Manage Workers", icon: "fa-hard-hat", path: "manage-workers" },
            { id: "complaints", label: "Manage Complaints", icon: "fa-stream", path: "complaints" },
            { id: "tasks", label: "Task Management", icon: "fa-tasks", path: "tasks" },
            { id: "reports", label: "Weekly Reports", icon: "fa-chart-bar", path: "reports" }
        ]
    },
    citizen: {
        title: "Citizen Portal",
        subtitle: "Report issues and track improvements",
        metrics: [
            { label: "Complaints Submitted", value: "0" },
            { label: "Resolved Reports", value: "0" },
            { label: "Impact Points", value: "0" }
        ],
        sections: [
            { id: "overview", label: "Dashboard", icon: "fa-tachometer-alt", path: "" },
            { id: "register", label: "Update Profile", icon: "fa-user-plus", path: "register" },
            { id: "complaint", label: "Make Complaint", icon: "fa-plus-circle", path: "complaint" },
            { id: "history", label: "History", icon: "fa-history", path: "history" }
        ]
    }
};

