const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    chat: {
        sendMessage: async (data: { conversationId?: string; message: string; userId?: string }) => {
            const response = await fetch(`${apiUrl}/api/chat/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return response.json();
        },
        getConversation: async (id: string) => {
            const response = await fetch(`${apiUrl}/api/chat/conversations/${id}`);
            return response.json();
        },
        listConversations: async (userId?: string) => {
            const url = userId
                ? `${apiUrl}/api/chat/conversations?userId=${userId}`
                : `${apiUrl}/api/chat/conversations`;
            const response = await fetch(url);
            return response.json();
        },
        deleteConversation: async (id: string) => {
            const response = await fetch(`${apiUrl}/api/chat/conversations/${id}`, {
                method: 'DELETE',
            });
            return response.json();
        },
    },
    agents: {
        list: async () => {
            const response = await fetch(`${apiUrl}/api/agents`);
            return response.json();
        },
        getCapabilities: async (type: string) => {
            const response = await fetch(`${apiUrl}/api/agents/${type}/capabilities`);
            return response.json();
        },
    },
};
