import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Plus, Save, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'react-hot-toast';

interface Goat {
  id?: string;
  tag: string;
  nickname: string;
  status: string;
  last_dosed: string;
  birthdate: string;
  mother_tag: string;
  father_tag: string;
  gender: string;
  user_id: string;
}

const LivestockRegistry: React.FC = () => {
  const [goats, setGoats] = useState<Goat[]>([]);
  const [newGoat, setNewGoat] = useState<Goat>({
    tag: '',
    nickname: '',
    status: 'healthy',
    last_dosed: new Date().toISOString().split('T')[0],
    birthdate: '',
    mother_tag: '',
    father_tag: '',
    gender: 'male',
    user_id: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      setNewGoat(prev => ({ ...prev, user_id: user.id }));
      fetchGoats();
    }
  }, [user]);

  const fetchGoats = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('goats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoats(data || []);
    } catch (error: any) {
      console.error('Error fetching goats:', error.message);
      toast.error('Failed to load goats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGoat({ ...newGoat, [name]: value });
  };

  const handleSelectChange = (name: keyof Goat, value: string) => {
    setNewGoat({ ...newGoat, [name]: value });
  };

  const handleDateChange = (date: Date | null, field: keyof Goat) => {
    if (date) {
      setNewGoat({ ...newGoat, [field]: date.toISOString().split('T')[0] });
    }
  };

  const verifyUserProfile = async () => {
    if (!user?.id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profile')
      .select('id')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      throw new Error('User profile not found. Please complete your profile first.');
    }
  };

  const handleAddGoat = async () => {
    if (!newGoat.tag.trim()) {
      toast.error('Tag number is required');
      return;
    }

    setIsLoading(true);
    try {
      await verifyUserProfile();

      const { data, error } = await supabase
        .from('goats')
        .insert([{ ...newGoat, user_id: user?.id }])
        .select();

      if (error) throw error;

      setGoats([data![0], ...goats]);
      toast.success('Goat added successfully!');
      resetForm();
    } catch (error: any) {
      console.error('Error adding goat:', error.message);
      toast.error(error.message || 'Failed to add goat');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewGoat({
      tag: '',
      nickname: '',
      status: 'healthy',
      last_dosed: new Date().toISOString().split('T')[0],
      birthdate: '',
      mother_tag: '',
      father_tag: '',
      gender: 'male',
      user_id: user?.id || '',
    });
    setShowAddForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Goat Registry</h1>
          <p className="text-gray-400">Manage all registered goats</p>
        </div>
        <Button 
          leftIcon={showAddForm ? <X size={16} /> : <Plus size={16} />}
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={!user?.id}
        >
          {showAddForm ? 'Cancel' : 'Add Goat'}
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-6 bg-zinc-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Goat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
              label="Tag Number *" 
              name="tag" 
              value={newGoat.tag} 
              onChange={handleInputChange} 
              placeholder="GT-001" 
              required 
            />
            <InputField 
              label="Nickname" 
              name="nickname" 
              value={newGoat.nickname} 
              onChange={handleInputChange} 
              placeholder="e.g. Spot" 
            />
            <SelectField 
              label="Gender" 
              value={newGoat.gender} 
              onChange={(value: string) => handleSelectChange('gender', value)} 
              options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' }
              ]} 
            />
            <SelectField 
              label="Status" 
              value={newGoat.status} 
              onChange={(value: string) => handleSelectChange('status', value)} 
              options={[
              { value: 'healthy', label: 'Healthy' },
              { value: 'sick', label: 'Sick' },
              { value: 'pregnant', label: 'Pregnant' }
              ]} 
            />
            <DateField 
              label="Birthdate" 
              date={newGoat.birthdate} 
              onChange={(date: Date | null) => handleDateChange(date, 'birthdate')} 
            />
            <DateField 
              label="Last Dosed Date" 
              date={newGoat.last_dosed} 
              onChange={(date: Date | null) => handleDateChange(date, 'last_dosed')} 
            />
            <InputField 
              label="Mother's Tag" 
              name="mother_tag" 
              value={newGoat.mother_tag} 
              onChange={handleInputChange} 
              placeholder="Mother's tag" 
            />
            <InputField 
              label="Father's Tag" 
              name="father_tag" 
              value={newGoat.father_tag} 
              onChange={handleInputChange} 
              placeholder="Father's tag" 
            />
            </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
            <Button leftIcon={<Save size={16} />} onClick={handleAddGoat} isLoading={isLoading}>Save Goat</Button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Registered Goats</h2>
        {isLoading ? (
          <p className="text-gray-400">Loading goats...</p>
        ) : goats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead>
                <tr>
                  {['Tag', 'Nickname', 'Gender', 'Status', 'Birthdate'].map(header => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {goats.map((goat) => (
                  <tr key={goat.id} className="hover:bg-zinc-800">
                    <td className="px-4 py-3 text-white">{goat.tag}</td>
                    <td className="px-4 py-3 text-gray-300">{goat.nickname || '-'}</td>
                    <td className="px-4 py-3 text-gray-300 capitalize">{goat.gender}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        goat.status === 'healthy' ? 'bg-emerald-900 text-emerald-300' :
                        goat.status === 'sick' ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {goat.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{goat.birthdate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No goats registered yet</p>
        )}
      </div>
    </div>
  );
};

export default LivestockRegistry;

// Helper UI components
const InputField = ({ label, ...props }: any) => (
  <div>
    <label className="block text-gray-300 mb-2">{label}</label>
    <Input {...props} />
  </div>
);

const SelectField = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="block text-gray-300 mb-2">{label}</label>
    <Select value={value} onChange={onChange} options={options} />
  </div>
);

const DateField = ({ label, date, onChange }: any) => (
  <div>
    <label className="block text-gray-300 mb-2">{label}</label>
    <DatePicker
      selected={date ? new Date(date) : null}
      onChange={onChange}
      dateFormat="yyyy-MM-dd"
      className="w-full p-2 bg-zinc-700 text-white rounded-md"
      placeholderText={`Select ${label.toLowerCase()}`}
    />
  </div>
);
