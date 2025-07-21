import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Plus, Search } from "lucide-react";
import { deleteUser, getUsers, updateUser, updateUserStatus } from "../../api/user";
import { useToast } from "../../context/ToastContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ConfirmationModal from "./ConfirmationModal";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { showToast } = useToast();
    const [pendingStatusChange, setPendingStatusChange] = useState(null); // { userId, newStatus, username }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await getUsers();
                setUsers(res);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUserData();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        try {
            await deleteUser(deletingUser._id);
            setUsers((prev) => prev.filter(u => u._id !== deletingUser._id));
            showToast("User deleted successfully!", { type: "success" });
        } catch (err) {
            console.error("Failed to delete user:", err);
            showToast("Failed to delete user.", { type: "error" });
        } finally {
            setDeletingUser(null);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        try {
            const updatedUserData = {
                username: editingUser.username,
                email: editingUser.email,
                role: editingUser.role,
            };
            const updated = await updateUser(editingUser._id, updatedUserData);
            setUsers(prev => prev.map(user => (user._id === updated._id ? updated : user)));
            setEditingUser(null);
            showToast("User updated successfully!", { type: "success" });
        } catch (err) {
            console.error("Failed to update user:", err);
            if (err?.response?.data?.error?.includes("duplicate key error")) {
                showToast("Email already exists. Please use a different one.", { type: "error" });
            } else {
                showToast("Failed to update user.", { type: "error" });
            }
        }
    };

    const handleChangeUserStatus = (userId, newStatus, username) => {
        setPendingStatusChange({ userId, newStatus, username });
    };
    const confirmChangeUserStatus = async () => {
        if (!pendingStatusChange) return;
        try {
            const res = await updateUserStatus(pendingStatusChange.userId, pendingStatusChange.newStatus);
            setUsers(prev => prev.map(u => u._id === pendingStatusChange.userId ? { ...u, status: pendingStatusChange.newStatus } : u));
            showToast(res.message || "User status updated", { type: "success" });
        } catch (err) {
            showToast(err?.response?.data?.error || err.message || "Failed to update status", { type: "error" });
        } finally {
            setPendingStatusChange(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case "banned":
                return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Users Management</h2>
            </div>
            <div className="flex space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Avatar className="h-8 w-8 mr-3">
                                                    <AvatarFallback className="bg-orange-100 text-orange-600">
                                                        {user.username?.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.role}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span>{getStatusBadge(user.status)}</span>
                                            {user.role !== 'admin' && (
                                                <select
                                                    value={user.status || 'active'}
                                                    onChange={e => handleChangeUserStatus(user._id, e.target.value, user.username)}
                                                    className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="banned">Banned</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setDeletingUser(user)}>
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold">Edit User</h2>
                        <div>
                            <label className="block text-sm mb-1">Username</label>
                            <Input
                                value={editingUser.username}
                                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <Input
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Role</label>
                            <select
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveEdit}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
            {deletingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold text-red-600">Confirm Deletion</h2>
                        <p>Are you sure you want to delete user <strong>{deletingUser.username}</strong>? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setDeletingUser(null)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={handleDeleteUser}
                            >
                                Confirm Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmationModal
                open={!!pendingStatusChange}
                title="Confirm Status Change"
                message={pendingStatusChange ? `Are you sure you want to change status of user '${pendingStatusChange.username}' to '${pendingStatusChange.newStatus}'?` : ''}
                onConfirm={confirmChangeUserStatus}
                onCancel={() => setPendingStatusChange(null)}
                confirmText="Change Status"
                cancelText="Cancel"
            />
        </div>
    );
}
