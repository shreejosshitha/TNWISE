import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { AIChatbot } from "../../components/AIChatbot";
import { Link } from "react-router";
import {
  Calculator, Zap, Lightbulb, Home, Car, ChefHat, Monitor, WashingMachine,
  Refrigerator, AirVent, ArrowLeft, TrendingDown, Target, Award, Leaf,
  DollarSign, Clock, Thermometer, Sun, Moon, Battery, BarChart3,
  AlertTriangle, CheckCircle, Sparkles, Brain, Cpu, Wind, Droplets, Plus, Download
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
  wattage: number;
  category: string;
  usageHours: number;
  quantity: number;
  efficiency: 'low' | 'medium' | 'high';
}

interface EnergyRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: any;
}

export function EnergyCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: '1', name: 'LED Bulb', icon: Lightbulb, wattage: 10, category: 'Lighting', usageHours: 8, quantity: 10, efficiency: 'high' },
    { id: '2', name: 'Refrigerator', icon: Refrigerator, wattage: 150, category: 'Kitchen', usageHours: 24, quantity: 1, efficiency: 'medium' },
    { id: '3', name: 'Air Conditioner', icon: AirVent, wattage: 1200, category: 'Cooling', usageHours: 8, quantity: 1, efficiency: 'medium' },
    { id: '4', name: 'Washing Machine', icon: WashingMachine, wattage: 500, category: 'Laundry', usageHours: 2, quantity: 1, efficiency: 'medium' },
    { id: '5', name: 'Computer/Laptop', icon: Monitor, wattage: 150, category: 'Electronics', usageHours: 8, quantity: 2, efficiency: 'high' },
    { id: '6', name: 'Water Heater', icon: Droplets, wattage: 2000, category: 'Heating', usageHours: 2, quantity: 1, efficiency: 'low' },
  ]);

  const [electricityRate, setElectricityRate] = useState(8); // INR per kWh
  const [householdSize, setHouseholdSize] = useState(4);
  const [location, setLocation] = useState('urban');
  const [aiRecommendations, setAiRecommendations] = useState<EnergyRecommendation[]>([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [monthlyBill, setMonthlyBill] = useState(0);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [efficiencyScore, setEfficiencyScore] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // Preset household configurations
  const householdPresets = {
    'small-family': {
      name: 'Small Family (2-3 people)',
      appliances: [
        { name: 'LED Bulb', wattage: 10, category: 'Lighting', usageHours: 6, quantity: 8, efficiency: 'high' },
        { name: 'Refrigerator', wattage: 120, category: 'Kitchen', usageHours: 24, quantity: 1, efficiency: 'medium' },
        { name: 'Washing Machine', wattage: 400, category: 'Laundry', usageHours: 1.5, quantity: 1, efficiency: 'medium' },
        { name: 'Computer/Laptop', wattage: 150, category: 'Electronics', usageHours: 6, quantity: 2, efficiency: 'high' },
        { name: 'Water Heater', wattage: 2000, category: 'Heating', usageHours: 1, quantity: 1, efficiency: 'low' },
      ]
    },
    'medium-family': {
      name: 'Medium Family (4-5 people)',
      appliances: [
        { name: 'LED Bulb', wattage: 10, category: 'Lighting', usageHours: 8, quantity: 12, efficiency: 'high' },
        { name: 'Refrigerator', wattage: 150, category: 'Kitchen', usageHours: 24, quantity: 1, efficiency: 'medium' },
        { name: 'Air Conditioner', wattage: 1200, category: 'Cooling', usageHours: 6, quantity: 1, efficiency: 'medium' },
        { name: 'Washing Machine', wattage: 500, category: 'Laundry', usageHours: 2, quantity: 1, efficiency: 'medium' },
        { name: 'Computer/Laptop', wattage: 150, category: 'Electronics', usageHours: 8, quantity: 3, efficiency: 'high' },
        { name: 'Water Heater', wattage: 2000, category: 'Heating', usageHours: 2, quantity: 1, efficiency: 'low' },
        { name: 'Microwave', wattage: 1000, category: 'Kitchen', usageHours: 0.5, quantity: 1, efficiency: 'medium' },
      ]
    },
    'large-family': {
      name: 'Large Family (6+ people)',
      appliances: [
        { name: 'LED Bulb', wattage: 10, category: 'Lighting', usageHours: 10, quantity: 15, efficiency: 'high' },
        { name: 'Refrigerator', wattage: 200, category: 'Kitchen', usageHours: 24, quantity: 1, efficiency: 'medium' },
        { name: 'Air Conditioner', wattage: 1200, category: 'Cooling', usageHours: 8, quantity: 2, efficiency: 'medium' },
        { name: 'Washing Machine', wattage: 600, category: 'Laundry', usageHours: 3, quantity: 1, efficiency: 'medium' },
        { name: 'Computer/Laptop', wattage: 150, category: 'Electronics', usageHours: 10, quantity: 4, efficiency: 'high' },
        { name: 'Water Heater', wattage: 3000, category: 'Heating', usageHours: 3, quantity: 1, efficiency: 'low' },
        { name: 'Microwave', wattage: 1200, category: 'Kitchen', usageHours: 1, quantity: 1, efficiency: 'medium' },
        { name: 'Dishwasher', wattage: 1800, category: 'Kitchen', usageHours: 1.5, quantity: 1, efficiency: 'medium' },
      ]
    },
    'bachelor': {
      name: 'Bachelor/Student',
      appliances: [
        { name: 'LED Bulb', wattage: 10, category: 'Lighting', usageHours: 6, quantity: 4, efficiency: 'high' },
        { name: 'Mini Fridge', wattage: 80, category: 'Kitchen', usageHours: 24, quantity: 1, efficiency: 'high' },
        { name: 'Laptop', wattage: 65, category: 'Electronics', usageHours: 8, quantity: 1, efficiency: 'high' },
        { name: 'Fan', wattage: 75, category: 'Cooling', usageHours: 12, quantity: 1, efficiency: 'high' },
        { name: 'Water Heater', wattage: 1500, category: 'Heating', usageHours: 1, quantity: 1, efficiency: 'medium' },
      ]
    }
  };

  // Calculate energy consumption
  const calculateConsumption = () => {
    const dailyConsumption = appliances.reduce((total, appliance) => {
      return total + (appliance.wattage * appliance.usageHours * appliance.quantity) / 1000; // Convert to kWh
    }, 0);

    const monthlyConsumption = dailyConsumption * 30;
    const bill = monthlyConsumption * electricityRate;
    const carbon = monthlyConsumption * 0.5; // kg CO2 per kWh (Indian average)

    setTotalConsumption(monthlyConsumption);
    setMonthlyBill(bill);
    setCarbonFootprint(carbon);

    // Calculate efficiency score (0-100)
    const efficiencyFactors = appliances.map(app => {
      const baseScore = app.efficiency === 'high' ? 100 : app.efficiency === 'medium' ? 70 : 40;
      const usageEfficiency = Math.max(0, 100 - (app.usageHours / 24) * 50);
      return (baseScore + usageEfficiency) / 2;
    });

    const avgEfficiency = efficiencyFactors.length > 0
      ? efficiencyFactors.reduce((a, b) => a + b, 0) / efficiencyFactors.length
      : 0;
    setEfficiencyScore(Math.round(avgEfficiency));

    generateAIRecommendations(monthlyConsumption, bill);
  };

  // Generate AI-powered recommendations
  const generateAIRecommendations = (consumption: number, bill: number) => {
    const recommendations: EnergyRecommendation[] = [];

    // Analyze appliance usage patterns
    const highUsageAppliances = appliances.filter(app => app.usageHours > 12);
    const inefficientAppliances = appliances.filter(app => app.efficiency === 'low');
    const highWattageAppliances = appliances.filter(app => app.wattage > 500);
    const lightingAppliances = appliances.filter(app => app.category === 'Lighting');
    const coolingAppliances = appliances.filter(app => app.category === 'Cooling');

    // Lighting recommendations
    if (lightingAppliances.some(app => app.efficiency !== 'high')) {
      recommendations.push({
        id: 'lighting-upgrade',
        title: 'Upgrade to LED Lighting',
        description: 'Replace incandescent bulbs with energy-efficient LED bulbs to save up to 80% on lighting costs.',
        potentialSavings: Math.round(bill * 0.15),
        difficulty: 'easy',
        category: 'Lighting',
        icon: Lightbulb
      });
    }

    // AC recommendations based on usage
    if (coolingAppliances.length > 0) {
      const acUsage = coolingAppliances.reduce((total, ac) => total + ac.usageHours, 0);
      if (acUsage > 10) {
        recommendations.push({
          id: 'ac-optimization',
          title: 'Optimize AC Usage',
          description: 'Set AC temperature to 24°C, use ceiling fans, and maintain filters for better efficiency.',
          potentialSavings: Math.round(bill * 0.25),
          difficulty: 'medium',
          category: 'Cooling',
          icon: Thermometer
        });
      }
    }

    // Appliance efficiency based on actual usage
    if (inefficientAppliances.length > 0) {
      const inefficientConsumption = inefficientAppliances.reduce((total, app) =>
        total + (app.wattage * app.usageHours * app.quantity) / 1000 * 30, 0
      );
      recommendations.push({
        id: 'appliance-upgrade',
        title: 'Upgrade to Energy-Efficient Appliances',
        description: `Your ${inefficientAppliances.length} inefficient appliance(s) consume ${inefficientConsumption.toFixed(0)} kWh/month. Consider BEE 5-star rated models.`,
        potentialSavings: Math.round(bill * 0.30),
        difficulty: 'hard',
        category: 'Appliances',
        icon: Refrigerator
      });
    }

    // Solar recommendations based on consumption
    if (consumption > 300) {
      const solarPotential = Math.min(consumption * 0.8, 500); // Assume 80% of consumption can be solar
      recommendations.push({
        id: 'solar-installation',
        title: 'Install Solar Panels',
        description: `Based on your ${consumption.toFixed(0)} kWh usage, solar panels could generate ${solarPotential.toFixed(0)} kWh, saving ₹${Math.round(bill * 0.75)}/month.`,
        potentialSavings: Math.round(bill * 0.75),
        difficulty: 'hard',
        category: 'Renewable',
        icon: Sun
      });
    }

    // Smart home based on appliance count
    if (appliances.length > 5) {
      recommendations.push({
        id: 'smart-home',
        title: 'Implement Smart Home Solutions',
        description: 'Use smart plugs, timers, and automation to reduce standby power consumption by 20-30%.',
        potentialSavings: Math.round(bill * 0.20),
        difficulty: 'medium',
        category: 'Technology',
        icon: Cpu
      });
    }

    // Behavioral changes based on high usage appliances
    if (highUsageAppliances.length > 0) {
      recommendations.push({
        id: 'behavioral-changes',
        title: 'Simple Behavioral Changes',
        description: `${highUsageAppliances.length} of your appliances run more than 12 hours daily. Unplug unused devices and use natural light.`,
        potentialSavings: Math.round(bill * 0.10),
        difficulty: 'easy',
        category: 'Behavior',
        icon: Brain
      });
    }

    // Seasonal recommendations
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) { // Summer months
      recommendations.push({
        id: 'summer-saving',
        title: 'Summer Energy Saving Tips',
        description: 'Use white curtains to reflect sunlight, cook during cooler hours, and use energy-efficient fans.',
        potentialSavings: Math.round(bill * 0.15),
        difficulty: 'easy',
        category: 'Seasonal',
        icon: Sun
      });
    } else if (currentMonth >= 10 || currentMonth <= 1) { // Winter months
      recommendations.push({
        id: 'winter-saving',
        title: 'Winter Energy Saving Tips',
        description: 'Use thermal curtains, seal windows, and use space heaters efficiently instead of central heating.',
        potentialSavings: Math.round(bill * 0.12),
        difficulty: 'easy',
        category: 'Seasonal',
        icon: Thermometer
      });
    }

    // Location-based recommendations
    if (location === 'urban') {
      recommendations.push({
        id: 'urban-efficiency',
        title: 'Urban Energy Efficiency',
        description: 'In urban areas, consider shared laundry facilities and optimize elevator usage patterns.',
        potentialSavings: Math.round(bill * 0.08),
        difficulty: 'medium',
        category: 'Location',
        icon: Home
      });
    }

    // High consumption alert
    if (consumption > 500) {
      recommendations.push({
        id: 'consumption-alert',
        title: 'High Consumption Alert',
        description: `Your consumption of ${consumption.toFixed(0)} kWh is above average. Consider an energy audit for detailed analysis.`,
        potentialSavings: Math.round(bill * 0.20),
        difficulty: 'medium',
        category: 'Analysis',
        icon: AlertTriangle
      });
    }

    setAiRecommendations(recommendations);
  };

  // Update appliance
  const updateAppliance = (id: string, field: keyof Appliance, value: any) => {
    if (field === 'wattage' || field === 'usageHours' || field === 'quantity') {
      value = Math.max(0, Number(value)); // Ensure non-negative values
    }
    setAppliances(prev => prev.map(app =>
      app.id === id ? { ...app, [field]: value } : app
    ));
  };

  // Add new appliance
  const addAppliance = () => {
    const newAppliance: Appliance = {
      id: Date.now().toString(),
      name: 'New Appliance',
      icon: Zap,
      wattage: 100,
      category: 'Other',
      usageHours: 4,
      quantity: 1,
      efficiency: 'medium'
    };
    setAppliances(prev => [...prev, newAppliance]);
  };

  // Remove appliance
  const removeAppliance = (id: string) => {
    setAppliances(prev => prev.filter(app => app.id !== id));
    toast.success('Appliance removed successfully');
  };

  // Export energy report
  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      settings: {
        electricityRate: electricityRate,
        householdSize: householdSize,
        location: location
      },
      consumption: {
        monthlyKwh: totalConsumption,
        estimatedBill: monthlyBill,
        carbonFootprint: carbonFootprint,
        efficiencyScore: efficiencyScore
      },
      appliances: appliances.map(app => ({
        name: app.name,
        wattage: app.wattage,
        usageHours: app.usageHours,
        quantity: app.quantity,
        efficiency: app.efficiency,
        dailyConsumption: (app.wattage * app.usageHours * app.quantity) / 1000,
        monthlyConsumption: ((app.wattage * app.usageHours * app.quantity) / 1000) * 30
      })),
      recommendations: aiRecommendations
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `energy-report-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Energy report exported successfully!');
  };

  // Load preset configuration
  const loadPreset = (presetKey: string) => {
    if (householdPresets[presetKey as keyof typeof householdPresets]) {
      const preset = householdPresets[presetKey as keyof typeof householdPresets];
      const presetAppliances = preset.appliances.map(app => ({
        ...app,
        id: Date.now().toString() + Math.random().toString(),
        icon: getIconForCategory(app.category)
      }));
      setAppliances(presetAppliances);
      setSelectedPreset(presetKey);
      toast.success(`Loaded ${preset.name} configuration`);
    }
  };

  // Get icon for category
  const getIconForCategory = (category: string) => {
    const iconMap: { [key: string]: any } = {
      'Lighting': Lightbulb,
      'Kitchen': ChefHat,
      'Cooling': AirVent,
      'Laundry': WashingMachine,
      'Electronics': Monitor,
      'Heating': Droplets,
      'Other': Zap
    };
    return iconMap[category] || Zap;
  };

  // Reset calculator
  const resetCalculator = () => {
    setAppliances([
      { id: '1', name: 'LED Bulb', icon: Lightbulb, wattage: 10, category: 'Lighting', usageHours: 8, quantity: 10, efficiency: 'high' },
      { id: '2', name: 'Refrigerator', icon: Refrigerator, wattage: 150, category: 'Kitchen', usageHours: 24, quantity: 1, efficiency: 'medium' },
      { id: '3', name: 'Air Conditioner', icon: AirVent, wattage: 1200, category: 'Cooling', usageHours: 8, quantity: 1, efficiency: 'medium' },
      { id: '4', name: 'Washing Machine', icon: WashingMachine, wattage: 500, category: 'Laundry', usageHours: 2, quantity: 1, efficiency: 'medium' },
      { id: '5', name: 'Computer/Laptop', icon: Monitor, wattage: 150, category: 'Electronics', usageHours: 8, quantity: 2, efficiency: 'high' },
      { id: '6', name: 'Water Heater', icon: Droplets, wattage: 2000, category: 'Heating', usageHours: 2, quantity: 1, efficiency: 'low' },
    ]);
    setSelectedPreset('');
    toast.success('Calculator reset to default appliances');
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate on mount and when appliances change
  useEffect(() => {
    calculateConsumption();
  }, [appliances, electricityRate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Government Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
        <Header showAuth={true} />
        <div className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-6">
              <Link
                to="/electricity"
                className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Electricity Services
              </Link>
              <div className="flex items-center space-x-4">
                <Calculator className="w-8 h-8 text-yellow-400" />
                <div>
                  <h1 className="text-2xl font-bold">Energy Calculator</h1>
                  <p className="text-blue-100">Calculate consumption & get AI-powered savings tips</p>
                </div>
                <Button onClick={resetCalculator} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={exportReport} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Consumption</p>
                  <p className="text-2xl font-bold text-blue-600">{totalConsumption.toFixed(1)} kWh</p>
                </div>
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estimated Bill</p>
                  <p className="text-2xl font-bold text-green-600">₹{monthlyBill.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Carbon Footprint</p>
                  <p className="text-2xl font-bold text-orange-600">{carbonFootprint.toFixed(1)} kg CO₂</p>
                </div>
                <Leaf className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Efficiency Score</p>
                  <p className={`text-2xl font-bold ${getEfficiencyColor(efficiencyScore)}`}>
                    {efficiencyScore}/100
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Energy Calculator</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="insights">Energy Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Calculator Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="electricity-rate">Electricity Rate (₹/kWh)</Label>
                    <Input
                      id="electricity-rate"
                      type="number"
                      value={electricityRate}
                      onChange={(e) => setElectricityRate(Math.max(0, Number(e.target.value)))}
                      className="mt-1"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="household-size">Household Size</Label>
                    <Input
                      id="household-size"
                      type="number"
                      value={householdSize}
                      onChange={(e) => setHouseholdSize(Math.max(1, Number(e.target.value)))}
                      className="mt-1"
                      min="1"
                      max="20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location Type</Label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="urban">Urban</option>
                      <option value="suburban">Suburban</option>
                      <option value="rural">Rural</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Household Presets */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Quick Setup - Household Presets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a preset configuration based on your household type to get started quickly:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(householdPresets).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant={selectedPreset === key ? "default" : "outline"}
                      onClick={() => loadPreset(key)}
                      className="h-auto p-4 text-left"
                    >
                      <div>
                        <div className="font-semibold">{preset.name}</div>
                        <div className="text-sm opacity-80 mt-1">
                          {preset.appliances.length} appliances
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  💡 Presets are starting points - customize them based on your actual usage patterns
                </p>
              </CardContent>
            </Card>

            {/* Appliances List */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Your Appliances
                  </div>
                  <Button onClick={addAppliance} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Appliance
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appliances.map((appliance) => (
                    <div key={appliance.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <appliance.icon className="w-8 h-8 text-blue-600" />
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Name</Label>
                          <Input
                            value={appliance.name}
                            onChange={(e) => updateAppliance(appliance.id, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Wattage</Label>
                          <Input
                            type="number"
                            value={appliance.wattage}
                            onChange={(e) => updateAppliance(appliance.id, 'wattage', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Hours/Day</Label>
                          <Input
                            type="number"
                            value={appliance.usageHours}
                            onChange={(e) => updateAppliance(appliance.id, 'usageHours', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Quantity</Label>
                          <Input
                            type="number"
                            value={appliance.quantity}
                            onChange={(e) => updateAppliance(appliance.id, 'quantity', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Efficiency</Label>
                          <select
                            value={appliance.efficiency}
                            onChange={(e) => updateAppliance(appliance.id, 'efficiency', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={() => removeAppliance(appliance.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI-Powered Energy Saving Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiRecommendations.map((rec) => (
                    <Card key={rec.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <rec.icon className="w-8 h-8 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                              <Badge className={getDifficultyColor(rec.difficulty)}>
                                {rec.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-600">
                                Save ₹{rec.potentialSavings}/month
                              </span>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Energy Efficiency Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Efficiency</span>
                        <span>{efficiencyScore}%</span>
                      </div>
                      <Progress value={efficiencyScore} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-green-800">Efficient Appliances</p>
                        <p className="text-lg font-bold text-green-600">
                          {appliances.filter(app => app.efficiency === 'high').length}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-yellow-800">Needs Improvement</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {appliances.filter(app => app.efficiency !== 'high').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-600 mb-1">
                        {carbonFootprint.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600">kg CO₂ per month</p>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Your monthly carbon footprint is equivalent to driving
                        {Math.round(carbonFootprint / 0.2)} km in a petrol car.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded">
                        <Wind className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                        <p className="text-xs text-blue-800">Renewable</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <Leaf className="w-4 h-4 mx-auto mb-1 text-green-600" />
                        <p className="text-xs text-green-800">Efficient</p>
                      </div>
                      <div className="p-2 bg-orange-50 rounded">
                        <Sun className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                        <p className="text-xs text-orange-800">Solar</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AIChatbot />
    </div>
  );
}