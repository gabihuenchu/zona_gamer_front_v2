import { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProductsManagement from '../components/Dashboard/ProductsManagement';
import UsersManagement from '../components/Dashboard/UsersManagement';
import Settings from '../components/Dashboard/Settings';
import { OrderService } from '../services/orderService';
import { UserService } from '../services/userService';
import { CalendarService } from '../services/calendarService';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('products');

    const renderSection = () => {
        switch (activeSection) {
            case 'products':
                return <ProductsManagement />;
            case 'users':
                return <UsersManagement />;
            default:
                return <ProductsManagement />;
        }
    };

    return (
        <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
            {renderSection()}
        </DashboardLayout>
    );
};

export default Dashboard;
