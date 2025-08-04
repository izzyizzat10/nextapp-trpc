'use client';

import {useState} from 'react';
import {trpc} from './TrpcProvider';

export default function UserManagement() {
    const [newUser, setNewUser] = useState({name: '', email: ''});
    const [editingUser, setEditingUser] = useState(null);

    // tRPC queries and mutations
    const {data: users, isLoading, refetch} = trpc.users.getAll.useQuery();
    const {data: userCount} = trpc.users.getCount.useQuery();

    const createUserMutation = trpc.users.create.useMutation({
        onSuccess: () => {
            refetch();
            setNewUser({name: '', email: ''});
        },
    });

    const updateUserMutation = trpc.users.update.useMutation({
        onSuccess: () => {
            refetch();
            setEditingUser(null);
        },
    });

    const deleteUserMutation = trpc.users.delete.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const handleCreateUser = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        createUserMutation.mutate(newUser);
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        if (!editingUser.name || !editingUser.email) return;

        updateUserMutation.mutate(editingUser);
    };

    const handleDeleteUser = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUserMutation.mutate({id});
        }
    };

    if (isLoading) {
        return <div style={{padding: '20px'}}>Loading users...</div>;
    }

    return (
        <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
            <h1>tRPC User Management</h1>

            {userCount && (
                <p style={{color: '#666', marginBottom: '20px'}}>
                    Total users: {userCount.count}
                </p>
            )}

            {/* Error Display */}
            {(createUserMutation.error || updateUserMutation.error || deleteUserMutation.error) && (
                <div style={{
                    padding: '10px',
                    marginBottom: '20px',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '4px',
                    color: '#c62828'
                }}>
                    Error: {createUserMutation.error?.message || updateUserMutation.error?.message || deleteUserMutation.error?.message}
                </div>
            )}

            {/* Create User Form */}
            <section style={{marginBottom: '30px'}}>
                <h2>Create New User</h2>
                <form onSubmit={handleCreateUser}>
                    <div style={{marginBottom: '10px'}}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            style={{padding: '8px', marginRight: '10px', width: '200px'}}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            style={{padding: '8px', marginRight: '10px', width: '200px'}}
                        />
                        <button
                            type="submit"
                            disabled={createUserMutation.isLoading}
                            style={{padding: '8px 16px'}}
                        >
                            {createUserMutation.isLoading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </section>

            {/* Users List */}
            <section>
                <h2>Users</h2>
                {!users || users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                        <tr style={{backgroundColor: '#f5f5f5'}}>
                            <th style={{padding: '10px', border: '1px solid #ccc', textAlign: 'left'}}>ID</th>
                            <th style={{padding: '10px', border: '1px solid #ccc', textAlign: 'left'}}>Name</th>
                            <th style={{padding: '10px', border: '1px solid #ccc', textAlign: 'left'}}>Email</th>
                            <th style={{padding: '10px', border: '1px solid #ccc', textAlign: 'left'}}>Created</th>
                            <th style={{padding: '10px', border: '1px solid #ccc', textAlign: 'left'}}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>{user.id}</td>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>
                                    {editingUser?.id === user.id ? (
                                        <form onSubmit={handleUpdateUser} style={{display: 'inline'}}>
                                            <input
                                                type="text"
                                                value={editingUser.name}
                                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                                style={{padding: '4px', width: '120px'}}
                                            />
                                        </form>
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>
                                    {editingUser?.id === user.id ? (
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                            style={{padding: '4px', width: '160px'}}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>
                                    {editingUser?.id === user.id ? (
                                        <>
                                            <button
                                                onClick={handleUpdateUser}
                                                disabled={updateUserMutation.isLoading}
                                                style={{
                                                    padding: '4px 8px',
                                                    marginRight: '5px',
                                                    backgroundColor: '#4caf50',
                                                    color: 'white'
                                                }}
                                            >
                                                {updateUserMutation.isLoading ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={() => setEditingUser(null)}
                                                style={{padding: '4px 8px', backgroundColor: '#757575', color: 'white'}}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setEditingUser({...user})}
                                                style={{padding: '4px 8px', marginRight: '5px'}}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={deleteUserMutation.isLoading}
                                                style={{padding: '4px 8px', backgroundColor: '#f44336', color: 'white'}}
                                            >
                                                {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
