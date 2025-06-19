import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Bell, Heart, Settings, Calendar, Satellite, User, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StarField from '@/components/StarField';

interface SavedEvent {
  id: string;
  event_type: string;
  event_title: string;
  event_date: string;
  event_data: any;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedEvents();
    }
  }, [user]);

  const fetchSavedEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setSavedEvents(data || []);
    } catch (error) {
      console.error('Error fetching saved events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white relative">
      <StarField />
      
      {/* Header with consistent branding */}
      <div className="relative z-10 pt-6 px-6">
        <motion.div
          className="flex items-center justify-center space-x-3 mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cosmic Navigator
            </h1>
            <p className="text-xs text-gray-400">Stellar Gateway Quest</p>
          </div>
        </motion.div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 pb-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Personal Dashboard
            </h2>
            <p className="text-xl text-gray-300">
              Welcome back to your cosmic command center, {user.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <Card className="bg-black/30 border-purple-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-400">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-purple-400/50 hover:bg-purple-500/20"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-black/30 border-blue-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-400">
                  <Satellite className="w-5 h-5" />
                  <span>Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Saved Events</span>
                    <Badge variant="outline" className="border-blue-400 text-blue-400">
                      {savedEvents.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chat Sessions</span>
                    <Badge variant="outline" className="border-blue-400 text-blue-400">
                      0
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Notifications</span>
                    <Badge variant="outline" className="border-blue-400 text-blue-400">
                      3
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-black/30 border-orange-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-400">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                    <p className="text-sm text-orange-300">ISS passing overhead in 2 hours</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-sm text-blue-300">Meteor shower peaks tonight</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-orange-400/50 hover:bg-orange-500/20"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saved Events */}
          <Card className="bg-black/30 border-white/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Heart className="w-5 h-5" />
                <span>Saved Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                  <p className="text-gray-400 mt-4">Loading saved events...</p>
                </div>
              ) : savedEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No saved events yet</p>
                  <p className="text-sm text-gray-500">Start exploring to save your favorite astronomical events</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 bg-white/10 rounded-lg border border-white/20 hover:border-purple-400/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{event.event_title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {event.event_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="text-center">
            <Button
              onClick={signOut}
              variant="outline"
              className="border-red-400/50 hover:bg-red-500/20 text-red-400"
            >
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
