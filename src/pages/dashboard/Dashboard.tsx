import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAuthStore } from '../../store/useAuthStore';
import { Users, Calendar, AlertTriangle, ClipboardList, UtensilsCrossed, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoatLogo } from '../../components/GoatLogo';

export const Dashboard: React.FC = () => {
  const { profile } = useAuthStore();
  const firstName = profile?.first_name || 'there';

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    to: string;
  }> = ({ title, value, icon, color, to }) => (
    <Link to={to}>
      <Card className="hover:border-emerald-700 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{title}</p>
              <p className="text-3xl font-bold text-white mt-2">{value}</p>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome, {firstName}!</h1>
        <p className="text-gray-400 mt-2">
          Here's what's happening at Bokamoso Farm today
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Livestock and other existing stat cards */}
        <StatCard
          title="Total Livestock"
          value={42}
          icon={<GoatLogo size={24} />}
          color="bg-emerald-500/20 text-emerald-500"
          to="/livestock"
        />
        <StatCard
          title="Employees"
          value={8}
          icon={<Users size={24} />}
          color="bg-blue-500/20 text-blue-500"
          to="/employees"
        />
        <StatCard
          title="Pending Leaves"
          value={3}
          icon={<Calendar size={24} />}
          color="bg-purple-500/20 text-purple-500"
          to="/leave"
        />
        <StatCard
          title="Health Alerts"
          value={1}
          icon={<AlertTriangle size={24} />}
          color="bg-red-500/20 text-red-500"
          to="/health"
        />

        {/* New stat cards for Cooking Schedule and Timetables */}
        <StatCard
          title="Cooking Schedule"
          value="View"
          icon={<UtensilsCrossed size={24} />}
          color="bg-orange-500/20 text-orange-500"
          to="/cooking-schedule"
        />
        <StatCard
          title="Timetables"
          value="View"
          icon={<BookOpen size={24} />}
          color="bg-teal-500/20 text-teal-500"
          to="/timetables"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Livestock Updates */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Livestock Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{ tag: 'A123', status: 'healthy', update: 'Vaccination completed', time: '2 hours ago' },
                { tag: 'B456', status: 'sick', update: 'Showing symptoms of fever', time: '5 hours ago' },
                { tag: 'C789', status: 'healthy', update: 'New goat registered', time: '1 day ago' }]
                .map((item, index) => (
                  <div key={index} className="flex items-start p-3 border border-zinc-800 rounded-md">
                    <div className="mr-4">
                      <GoatLogo size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white">Goat #{item.tag}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-500' :
                            item.status === 'sick' ? 'bg-red-500/20 text-red-500' :
                              'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{item.update}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{ task: 'Goat vaccination schedule', date: 'Today', priority: 'high' },
                { task: 'Submit monthly report', date: 'Tomorrow', priority: 'medium' },
                { task: 'Employee training session', date: 'Jun 28', priority: 'low' },
                { task: 'Review student timetables', date: 'Jun 30', priority: 'medium' }]
                .map((item, index) => (
                  <div key={index} className="flex items-center p-3 border border-zinc-800 rounded-md">
                    <div className="mr-3">
                      <div className={`h-3 w-3 rounded-full ${
                        item.priority === 'high' ? 'bg-red-500' :
                          item.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-emerald-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{item.task}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                    <div>
                      <ClipboardList size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
