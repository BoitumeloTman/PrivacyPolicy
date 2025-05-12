import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { GoatLogo } from '../../components/GoatLogo';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Goat {
  id: string;
  tag: string;
  status: string;
  last_checkup: string;
  notes: string;
}

interface HealthRecord {
  id: string;
  goat_id: string;
  runny_tummy: boolean;
  temp_above_38_5: boolean;
  lame: boolean;
  not_eating: boolean;
  eye_membrane_white: boolean;
  white_worms_on_stool: boolean;
  date_of_record: string;
  task_to_be_done: string;
  status: 'notSet' | 'ongoing' | 'completed';
  created_at: string;
}

export const HealthRecords: React.FC = () => {
  const [goats, setGoats] = useState<Goat[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [selectedGoat, setSelectedGoat] = useState<Goat | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<HealthRecord, 'id' | 'goat_id' | 'created_at'>>({
    runny_tummy: false,
    temp_above_38_5: false,
    lame: false,
    not_eating: false,
    eye_membrane_white: false,
    white_worms_on_stool: false,
    date_of_record: new Date().toISOString().split('T')[0],
    task_to_be_done: '',
    status: 'notSet',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoats = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('goats')
          .select('*');

        if (error) throw error;

        setGoats(data as Goat[]);
      } catch (error) {
        console.error('Error fetching goats:', error);
        alert('Failed to load goats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoats();
  }, []);

  const fetchHealthRecords = async (goatId: string) => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('goat_id', goatId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHealthRecords(data as HealthRecord[]);
    } catch (error) {
      console.error('Error fetching health records:', error);
    }
  };

  const handleGoatDetailsClick = (goatId: string) => {
    navigate(`/health-questionnaire/${goatId}`);
  };

  const handleGoatSelect = async (goat: Goat) => {
    setSelectedGoat(goat);
    await fetchHealthRecords(goat.id);
    setFormData({
      runny_tummy: false,
      temp_above_38_5: false,
      lame: false,
      not_eating: false,
      eye_membrane_white: false,
      white_worms_on_stool: false,
      date_of_record: new Date().toISOString().split('T')[0],
      task_to_be_done: '',
      status: 'notSet',
    });
    setSelectedRecord(null);
  };

  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setFormData({
      runny_tummy: record.runny_tummy,
      temp_above_38_5: record.temp_above_38_5,
      lame: record.lame,
      not_eating: record.not_eating,
      eye_membrane_white: record.eye_membrane_white,
      white_worms_on_stool: record.white_worms_on_stool,
      date_of_record: record.date_of_record,
      task_to_be_done: record.task_to_be_done,
      status: record.status,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatusChange = (status: 'notSet' | 'ongoing' | 'completed') => {
    setFormData(prev => ({ ...prev, status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGoat) return;

    try {
      setIsLoading(true);
      const recordData = {
        ...formData,
        goat_id: selectedGoat.id
      };

      const { data, error } = selectedRecord
        ? await supabase
            .from('health_records')
            .update(recordData)
            .eq('id', selectedRecord.id)
            .select()
        : await supabase
            .from('health_records')
            .insert(recordData)
            .select();

      if (error) throw error;

      if (selectedRecord) {
        setHealthRecords(healthRecords.map(r => 
          r.id === selectedRecord.id ? (data[0] as HealthRecord) : r
        ));
      } else {
        setHealthRecords([data[0] as HealthRecord, ...healthRecords]);
      }

      alert(`Health record ${selectedRecord ? 'updated' : 'created'} successfully!`);
      setSelectedRecord(null);
      setFormData({
        runny_tummy: false,
        temp_above_38_5: false,
        lame: false,
        not_eating: false,
        eye_membrane_white: false,
        white_worms_on_stool: false,
        date_of_record: new Date().toISOString().split('T')[0],
        task_to_be_done: '',
        status: 'notSet',
      });
    } catch (error) {
      console.error('Error saving health record:', error);
      alert(`Failed to ${selectedRecord ? 'update' : 'create'} health record`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && goats.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="text-white text-xl">Loading goats...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Goat Health Records</h1>
        <p className="text-gray-400 mt-2">Manage and review goat health statuses</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goats.map((goat) => (
          <Card
            key={goat.id}
            className={`${selectedGoat?.id === goat.id ? 'border-2 border-emerald-500' : 'border border-gray-700'}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => handleGoatDetailsClick(goat.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <GoatLogo size={24} />
                    <h3 className="font-medium text-white">Goat #{goat.tag}</h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-400">Status:</span> {goat.status}
                    </p>
                    <p>
                      <span className="text-gray-400">Last Checkup:</span> {goat.last_checkup || 'N/A'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoatSelect(goat);
                  }}
                  className="ml-4 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Records
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedGoat && (
        <div className="mt-8 bg-zinc-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Health Records for Goat #{selectedGoat.tag}
            </h2>
            <button 
              onClick={() => setSelectedGoat(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Health Records List */}
          <div className="mb-6 max-h-60 overflow-y-auto">
            {healthRecords.length > 0 ? (
              <div className="space-y-2">
                {healthRecords.map((record) => (
                  <div 
                    key={record.id} 
                    className={`p-3 rounded cursor-pointer ${selectedRecord?.id === record.id ? 'bg-zinc-700' : 'bg-zinc-900 hover:bg-zinc-800'}`}
                    onClick={() => handleEditRecord(record)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white">{new Date(record.created_at).toLocaleDateString()}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        record.status === 'notSet' ? 'bg-red-600' :
                        record.status === 'ongoing' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                    {record.task_to_be_done && (
                      <p className="text-gray-300 text-sm mt-1">{record.task_to_be_done}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No health records found for this goat</p>
            )}
          </div>

          {/* Health Record Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Symptoms Column */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Symptoms</h3>
                <div className="space-y-2">
                  {[
                    { name: 'runny_tummy', label: 'Runny Tummy' },
                    { name: 'temp_above_38_5', label: 'Temp > 38.5°C' },
                    { name: 'lame', label: 'Lame' },
                    { name: 'not_eating', label: 'Not Eating' },
                    { name: 'eye_membrane_white', label: 'Eye Membrane is White' },
                    { name: 'white_worms_on_stool', label: 'White Worms on Stool' },
                  ].map((symptom) => (
                    <label key={symptom.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={symptom.name}
                        checked={formData[symptom.name as keyof typeof formData] as boolean}
                        onChange={handleInputChange}
                        className="rounded text-blue-500"
                      />
                      <span className="text-white">{symptom.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-white">Date of Record</label>
                  <input
                    type="date"
                    name="date_of_record"
                    value={formData.date_of_record}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-white">Task to be done</label>
                  <input
                    type="text"
                    name="task_to_be_done"
                    value={formData.task_to_be_done}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600"
                    placeholder="Enter treatment or action needed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-white">Status</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('notSet')}
                      className={`px-3 py-1 rounded text-sm ${
                        formData.status === 'notSet' ? 'bg-red-600 text-white' : 'bg-zinc-700 text-gray-300'
                      }`}
                    >
                      Not Set
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('ongoing')}
                      className={`px-3 py-1 rounded text-sm ${
                        formData.status === 'ongoing' ? 'bg-yellow-600 text-white' : 'bg-zinc-700 text-gray-300'
                      }`}
                    >
                      Ongoing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('completed')}
                      className={`px-3 py-1 rounded text-sm ${
                        formData.status === 'completed' ? 'bg-green-600 text-white' : 'bg-zinc-700 text-gray-300'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (selectedRecord ? 'Update Record' : 'Create Record')}
              </button>
              {selectedRecord && (
                <button
                  type="button"
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-white"
                  onClick={() => {
                    setSelectedRecord(null);
                    setFormData({
                      runny_tummy: false,
                      temp_above_38_5: false,
                      lame: false,
                      not_eating: false,
                      eye_membrane_white: false,
                      white_worms_on_stool: false,
                      date_of_record: new Date().toISOString().split('T')[0],
                      task_to_be_done: '',
                      status: 'notSet',
                    });
                  }}
                  disabled={isLoading}
                >
                  New Record
                </button>
              )}
              <button
                type="button"
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-white"
                onClick={() => setSelectedGoat(null)}
                disabled={isLoading}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;