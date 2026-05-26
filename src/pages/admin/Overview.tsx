
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, CreditCard, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeShipments: 0,
    monthlyRevenue: 0,
    issues: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch total users
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // Fetch active shipments (not delivered)
        const { count: shipmentCount, error: shipmentError } = await supabase
          .from('shipments')
          .select('*', { count: 'exact', head: true })
          .not('status', 'eq', 'Delivered');

        if (shipmentError) throw shipmentError;

        // Fetch revenue from completed payments
        const { data: payments, error: paymentError } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'Completed');

        if (paymentError) throw paymentError;

        const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

        // Fetch shipments with issues (delayed, issues, etc)
        const { count: issuesCount, error: issuesError } = await supabase
          .from('shipments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Delayed');

        if (issuesError) throw issuesError;

        setStats({
          totalUsers: userCount || 0,
          activeShipments: shipmentCount || 0,
          monthlyRevenue: totalRevenue,
          issues: issuesCount || 0
        });

        // Fetch recent activity
        const { data: recentData, error: recentError } = await supabase
          .from('shipments')
          .select('id, created_at, tracking_number, user_id, profiles:user_id(email)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;
        setRecentActivity(recentData || []);

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and key metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.activeShipments}</div>
            <p className="text-xs text-muted-foreground">Shipments in progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${isLoading ? '...' : stats.monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From completed payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.issues}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System events in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm">Loading recent activity...</p>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <div className="text-sm">
                      <span className="font-medium">Shipment {activity.tracking_number}</span>
                      <span className="text-muted-foreground">
                        {' created for '}
                        <span className="font-medium">{activity.profiles?.email || 'a user'}</span>
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>All systems operational</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">API</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment Gateway</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tracking Service</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">File Storage</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
