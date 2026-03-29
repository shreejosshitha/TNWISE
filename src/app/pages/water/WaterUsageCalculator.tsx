import { useState, useEffect } from "react";

import { AIChatbot } from "../../components/AIChatbot";

import { Link } from "react-router-dom";

import {
  Droplets, Droplet, Home, Car, ChefHat, Monitor, WashingMachine,
  Thermometer, ArrowLeft, TrendingDown, Target, Award, Leaf,
  DollarSign, Clock, Download
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Alert, AlertDescription } from "../../components/ui/alert";

interface Appliance {
  id: string;
  name: string;
  icon: any;
  flowRate: number; // liters per minute
  usageMinutes: number;
  quantity: number;
  efficiency: 'low' | 'medium' | 'high';
  category: string;
}

interface WaterRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: any;
}

export function WaterUsageCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: '1', name: 'Shower', icon: Droplets, flowRate: 10, category: 'Bathroom', usageMinutes: 480, quantity: 4, efficiency: 'medium' },
    { id: '2', name: 'Faucet', icon: Droplet, flowRate: 8, category: 'Bathroom', usageMinutes: 600, quantity: 2, efficiency: 'low' },
    { id: '3', name: 'Washing Machine', icon: WashingMachine, flowRate: 60, category: 'Laundry', usageMinutes: 120, quantity: 1, efficiency: 'medium' },
    { id: '4', name: 'RO Purifier', icon: Droplets, flowRate: 0.5, category: 'Kitchen', usageMinutes: 1440, quantity: 1, efficiency: 'high' },
    { id: '5', name: 'Water Pump', icon: Droplets, flowRate: 30, category: 'Outdoor', usageMinutes: 60, quantity: 1, efficiency: 'low' },
    { id: '6', name: 'Dishwasher', icon: ChefHat, flowRate: 12, category: 'Kitchen', usageMinutes: 90, quantity: 1, efficiency: 'medium' },
  ]);

  const [waterRate, setWaterRate] = useState(5); // INR per 1000 liters
  const [householdSize, setHouseholdSize] = useState(4);
  const [location, setLocation] = useState('urban');
  const [aiRecommendations, setAiRecommendations] = useState<WaterRecommendation[]>([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [monthlyBill, setMonthlyBill] = useState(0);
  const [efficiencyScore, setEfficiencyScore] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // Water household presets
  const householdPresets = {
    'small-family': {
      name: 'Small Family (2-3 people)',
      appliances: [
        { name: 'Shower', flowRate: 8, category: 'Bathroom', usageMinutes: 360, quantity: 2, efficiency: 'medium' },
        { name: 'Faucet', flowRate: 6, category: 'Bathroom', usageMinutes: 480, quantity: 1, efficiency: 'high' },
        { name: 'Washing Machine', flowRate: 50, category: 'Laundry', usageMinutes: 90, quantity: 1, efficiency: 'medium' },
        { name: 'RO Purifier', flowRate: 0.5, category: 'Kitchen', usageMinutes: 1440, quantity: 1, efficiency: 'high' },
      ]
    },
    // Add more presets...
  };

  const calculateConsumption = () => {
    const monthlyConsumption = appliances.reduce((total, appliance) => {
      return total + (appliance.flowRate * appliance.usageMinutes * appliance.quantity * 30 / 60) / 1000; // KL
    }, 0);

    const bill = monthlyConsumption * waterRate;
    setTotalConsumption(monthlyConsumption);
    setMonthlyBill(bill);

    // Efficiency score
    const avgEfficiency = appliances.reduce((sum, app) => {
      const score = app.efficiency === 'high' ? 100 : app.efficiency === 'medium' ? 70 : 40;
      return sum + score;
    }, 0) / appliances.length;
    setEfficiencyScore(Math.round(avgEfficiency));

    generateWaterRecommendations(monthlyConsumption, bill);
  };

  const generateWaterRecommendations = (consumption: number, bill: number) => {
    const recommendations: WaterRecommendation[] = [
      {
        id: 'low-flow-fixtures',
        title: 'Install Low-Flow Fixtures',
        description: 'Replace showerheads and faucets with low-flow models to save 40-60% water.',
        potentialSavings: Math.round(bill * 0.5),
        difficulty: 'easy',
        category: 'Bathroom',
        icon: Droplets
      },
      {
        id: 'leak-detection',
        title: 'Fix Leaks Immediately',
        description: 'A dripping faucet wastes 20 liters/day. Check all taps monthly.',
        potentialSavings: Math.round(bill * 0.2),
        difficulty: 'easy',
        category: 'Maintenance',
        icon: Droplets
      },
      {
        id: 'rainwater-harvesting',
        title: 'Rainwater Harvesting',
        description: 'Collect rooftop rainwater for gardening and non-potable use.',
        potentialSavings: Math.round(bill * 0.3),
        difficulty: 'medium',
        category: 'Sustainable',
        icon: Droplet
      },
      // More water-specific recs...
    ];
    setAiRecommendations(recommendations);
  };

  const updateAppliance = (id: string, field: keyof Appliance, value: any) => {
    setAppliances(prev => prev.map(app =>
      app.id === id ? { ...app, [field]: Number(value) || value } : app
    ));
  };

  const addAppliance = () => {
    const newAppliance: Appliance = {
      id: Date.now().toString(),
      name: 'New Appliance',
      icon: Droplets,
      flowRate: 10,
      category: 'Other',
      usageMinutes: 60,
      quantity: 1,
      efficiency: 'medium'
    };
    setAppliances(prev => [...prev, newAppliance]);
  };

  useEffect(() => {
    calculateConsumption();
  }, [appliances, waterRate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-8"> 
        <Link
          to="/water"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Water Services
        </Link>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Usage</p>
                  <p className="text-2xl font-bold text-blue-600">{totalConsumption.toFixed(0)} KL</p>
                </div>
                <Droplets className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          {/* More cards... */}
        </div>

        {/* Calculator Tabs like EnergyCalculator */}
        <Tabs defaultValue="calculator">
          {/* Implement tabs similar to EnergyCalculator */}
        </Tabs>
      </div>
      <AIChatbot />
    </div>
  );
}
