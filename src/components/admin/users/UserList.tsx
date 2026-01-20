"use client";

import { useState } from "react";
import { useAdminUsers, useAdminUserDelete, useAdminUserRestore, useAdminUserUpdateRole } from "@/src/hooks/use-admin-users";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Trash2, RotateCcw, Search, Loader2, Shield, ShieldOff } from "lucide-react";
import { formatDate } from "@/src/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/src/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useAuthStore } from "@/src/store/auth";

export function UserList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "deleted">("active");
  const [role, setRole] = useState<"ADMIN" | "USER" | "ALL">("ALL");

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 20,
    search,
    status,
    role: role === "ALL" ? undefined : role,
  });

  const deleteUser = useAdminUserDelete();
  const restoreUser = useAdminUserRestore();
  const updateRole = useAdminUserUpdateRole();
  const currentUser = useAuthStore(state => state.user);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  const users = data?.users || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Select value={role} onValueChange={(val: any) => setRole(val)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow key={user.id} className={user.deletedAt ? "opacity-60 bg-muted/50" : ""}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={user.avatar || ""} />
                        <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {user.name}
                      {user.deletedAt && <Badge variant="destructive" className="ml-2">Deleted</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {user.deletedAt ? (
                       <Button
                       variant="outline"
                       size="icon"
                       onClick={() => {
                           if(confirm("Restore this user?")) restoreUser.mutate(user.id)
                       }}
                       title="Restore"
                     >
                       <RotateCcw className="h-4 w-4" />
                     </Button> 
                    ) : (
                        <>
                        {/* Toggle Role Button */}
                        {user.id !== currentUser?.id && (
                             <Button
                             variant="ghost"
                             size="icon"
                             title={user.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                             onClick={() => {
                                 const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
                                 if(confirm(`Change role to ${newRole}?`)) {
                                     updateRole.mutate({ id: user.id, role: newRole });
                                 }
                             }}
                         >
                             {user.role === "ADMIN" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                         </Button>
                        )}
                       
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            disabled={user.id === currentUser?.id}
                            onClick={() => {
                                if(confirm("Are you sure you want to delete this user?")) deleteUser.mutate(user.id)
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination Controls */}
       {pagination && (
        <div className="flex justify-end gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
            >
                Previous
            </Button>
            <div className="flex items-center text-sm">
                Page {page} of {pagination.totalPages}
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
            >
                Next
            </Button>
        </div>
      )}
    </div>
  );
}
