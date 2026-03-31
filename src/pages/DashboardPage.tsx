import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  MessageSquare, 
  Heart, 
  Eye, 
  TrendingUp,
  Wallet,
  Send,
  UserPlus,
  Crown,
  ArrowRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore, useRequestsStore } from '@/store';
import { mockRequests, mockModels, mockAgencies, getUserById } from '@/data/mock';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { receivedRequests, sentRequests } = useRequestsStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const stats = [
    {
      title: 'Profile Views',
      value: '124',
      change: '+12%',
      icon: Eye,
      color: 'bg-blue-500',
    },
    {
      title: 'Requests Sent',
      value: sentRequests.length.toString(),
      change: '+3',
      icon: Send,
      color: 'bg-green-500',
    },
    {
      title: 'Requests Received',
      value: receivedRequests.length.toString(),
      change: '+1',
      icon: UserPlus,
      color: 'bg-purple-500',
    },
    {
      title: 'Favorites',
      value: '8',
      icon: Heart,
      color: 'bg-pink-500',
    },
  ];

  const recentActivity = [
    { type: 'view', message: 'Elite Paris viewed your profile', time: '2 hours ago' },
    { type: 'request', message: 'You sent a request to Next Models', time: '5 hours ago' },
    { type: 'message', message: 'New message from Fashion Star', time: '1 day ago' },
  ];

  const myRequests = mockRequests.filter(
    req => req.fromUserId === user.id || req.toUserId === user.id
  );

  return (
    <div className="p-4 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your profile today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => navigate('/models')}
                >
                  <Users className="w-6 h-6 text-amber-500" />
                  <span className="text-sm">Browse Models</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => navigate('/agencies')}
                >
                  <Building2 className="w-6 h-6 text-blue-500" />
                  <span className="text-sm">Browse Agencies</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="w-6 h-6 text-green-500" />
                  <span className="text-sm">Messages</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => navigate('/balance')}
                >
                  <Wallet className="w-6 h-6 text-purple-500" />
                  <span className="text-sm">Balance</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Requests</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/requests')}>
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No requests yet</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Start by browsing and connecting with {user.role === 'model' ? 'agencies' : 'models'}
                  </p>
                  <Button 
                    onClick={() => navigate(user.role === 'model' ? '/agencies' : '/models')}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    {user.role === 'model' ? 'Browse Agencies' : 'Browse Models'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.slice(0, 3).map((request) => {
                    const otherUser = getUserById(
                      request.fromUserId === user.id ? request.toUserId : request.fromUserId
                    );
                    return (
                      <div 
                        key={request.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={otherUser?.avatar} />
                            <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{otherUser?.name}</p>
                            <p className="text-xs text-gray-500">
                              {request.type === 'model_to_agency' ? 'Wants to join' : 'Invitation'}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={request.status === 'accepted' ? 'default' : request.status === 'declined' ? 'destructive' : 'secondary'}
                          className={request.status === 'accepted' ? 'bg-green-500' : ''}
                        >
                          {request.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'view' ? 'bg-blue-100' :
                      activity.type === 'request' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'view' && <Eye className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'request' && <Send className="w-4 h-4 text-green-600" />}
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Profile Card */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-gray-500 text-sm capitalize">{user.role}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {user.isVerified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Star className="w-3 h-3 mr-1 fill-blue-700" />
                      Verified
                    </Badge>
                  )}
                  {user.subscriptionType !== 'free' && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      <Crown className="w-3 h-3 mr-1" />
                      {user.subscriptionType}
                    </Badge>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Balance</span>
                    <span className="font-semibold">${user.balance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Profile completion</span>
                    <span className="font-semibold">75%</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
                  onClick={() => user?.id && navigate(`/profile/${user.id}`)}
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Promo */}
          {user.subscriptionType === 'free' && (
            <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-6 h-6" />
                  <h3 className="font-semibold">Upgrade to Plus</h3>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  Get unlimited views, 10 contacts per month, and priority in search results.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4" />
                    Unlimited profile views
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4" />
                    10 contacts per month
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4" />
                    Priority search placement
                  </li>
                </ul>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate('/balance')}
                >
                  Upgrade Now - $29/mo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Daily Limits */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Daily Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Profile views</span>
                    <span className="font-medium">12/15</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Requests this week</span>
                    <span className="font-medium">0/1</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
