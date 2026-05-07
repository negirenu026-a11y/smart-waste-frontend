import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import CitizenModuleView from './pages/CitizenModuleView';
import History from './pages/History';
import Register from './pages/Register';

const CitizenRoutes = () => {
    return (
        <Routes>
            <Route path="register" element={<Register />} />
            <Route path="complaint" element={<CitizenModuleView />} />
            <Route path="history" element={<History />} />
            {/* Default redirect for citizen sub-routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default CitizenRoutes;
