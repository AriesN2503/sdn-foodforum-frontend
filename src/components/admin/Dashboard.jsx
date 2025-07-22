import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { MessageSquare } from "lucide-react";
import React from "react";

export default function Dashboard({ stats, latestUser, latestPost }) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                        {/* <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p> */}
                                    </div>
                                    <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {latestUser && (
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-orange-100 text-orange-600">{latestUser.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">New User:</div>
                                    <div>{latestUser.username} ({latestUser.email})</div>
                                    <div className="text-xs text-gray-500">Joined: {latestUser.createdAt ? new Date(latestUser.createdAt).toLocaleString() : ''}</div>
                                </div>
                            </div>
                        )}
                        {latestPost && (
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 text-purple-600 rounded-full p-2">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="font-semibold">New Post:</div>
                                    <div>{latestPost.title} by {latestPost.author?.username || latestPost.author || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">Posted: {latestPost.createdAt ? new Date(latestPost.createdAt).toLocaleString() : ''}</div>
                                </div>
                            </div>
                        )}
                        {!latestUser && !latestPost && <div className="text-gray-500">No recent activity.</div>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
