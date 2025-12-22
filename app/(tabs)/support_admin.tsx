import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { supportApi } from '../../src/api/support';
import { useEntitlements } from '../../src/hooks/useEntitlements';
import { MessageSquare, AlertCircle, CheckCircle, LifeBuoy } from 'lucide-react-native';

export default function SupportAdminScreen() {
  const { isSupport } = useEntitlements();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (isSupport) supportApi.getAllTickets().then(setTickets);
  }, [isSupport]);

  if (!isSupport) return <View className="flex-1 bg-rose-50 items-center justify-center p-10"><Text>Access Denied: Agent Credentials Required</Text></View>;

  return (
    <View className="flex-1 bg-[#F0F9FF] flex-row">
      {/* Sidebar: Ticket Queue */}
      <View className="w-1/3 border-r border-white/50 p-4">
        <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-[2px] mb-4">Open Tickets</Text>
        <FlatList
          data={tickets}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setSelectedTicket(item)}
              className={`p-4 rounded-3xl mb-3 border ${selectedTicket?.id === item.id ? 'bg-white border-sky-200 shadow-sm' : 'bg-white/40 border-white/60'}`}
            >
              <Text className="font-bold text-slate-700">{item.subject}</Text>
              <Text className="text-slate-400 text-xs mt-1">{item.profiles?.full_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Main Panel: Conversation & Action */}
      <View className="flex-1 p-8">
        {selectedTicket ? (
          <View className="flex-1">
             <View className="flex-row justify-between items-center mb-6">
               <Text className="text-2xl font-black text-slate-800">{selectedTicket.subject}</Text>
               <TouchableOpacity className="bg-mint-400 px-4 py-2 rounded-full">
                 <Text className="text-white font-bold text-xs uppercase">Resolve</Text>
               </TouchableOpacity>
             </View>
             
             <View className="bg-white/60 p-6 rounded-[40px] flex-1 mb-6 border border-white">
                <Text className="text-slate-600 leading-relaxed">{selectedTicket.description}</Text>
             </View>

             <View className="flex-row items-center bg-white/80 p-2 rounded-full border border-sky-100">
               <TextInput 
                 className="flex-1 px-4 text-slate-700" 
                 placeholder="Type your response as Support..."
                 value={reply}
                 onChangeText={setReply}
               />
               <TouchableOpacity className="bg-sky-500 w-12 h-12 rounded-full items-center justify-center">
                 <MessageSquare color="white" size={20} />
               </TouchableOpacity>
             </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center opacity-20">
            <LifeBuoy size={80} color="#64748b" />
            <Text className="mt-4 font-bold">Select a ticket to assist</Text>
          </View>
        )}
      </View>
    </View>
  );
}