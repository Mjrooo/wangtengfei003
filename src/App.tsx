import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Warehouse, 
  Headset, 
  TrendingUp, 
  Settings, 
  HelpCircle, 
  MessageSquare,
  PackageSearch,
  Activity,
  Cpu,
  Lock,
  UserCircle,
  Bell,
  Search,
  ChevronRight,
  Menu,
  X,
  FileText,
  AlertTriangle,
  History,
  Database,
  Monitor,
  RefreshCw,
  LogOut,
  Truck,
  MapPin,
  QrCode,
  FileCheck,
  ShoppingCart,
  Factory,
  Zap,
  Scale,
  Users,
  Eye,
  Thermometer,
  ClipboardList,
  Layers,
  Droplets,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const QUALITY_DATA = [
  { name: '03-12', rate: 98.2 },
  { name: '03-13', rate: 98.5 },
  { name: '03-14', rate: 97.8 },
  { name: '03-15', rate: 99.1 },
  { name: '03-16', rate: 98.9 },
  { name: '03-17', rate: 99.3 },
  { name: '03-18', rate: 99.5 },
];

const WAREHOUSE_ENV = [
  { time: '00:00', temp: 22, hum: 45 },
  { time: '04:00', temp: 21, hum: 48 },
  { time: '08:00', temp: 23, hum: 42 },
  { time: '12:00', temp: 26, hum: 38 },
  { time: '16:00', temp: 25, hum: 40 },
  { time: '20:00', temp: 23, hum: 44 },
];

const SALES_PREDICTION = [
  { month: '1月', actual: 4000, predict: 4200 },
  { month: '2月', actual: 3000, predict: 3100 },
  { month: '3月', actual: 2000, predict: 2500 },
  { month: '4月', actual: 2780, predict: 3000 },
  { month: '5月', actual: 1890, predict: 2200 },
  { month: '6月', actual: 2390, predict: 2800 },
];

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-left",
      active 
        ? "bg-haiwei-blue text-white shadow-lg shadow-haiwei-blue/20" 
        : "text-slate-500 hover:bg-slate-100 hover:text-haiwei-blue"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:scale-110 shrink-0", active ? "text-white" : "text-slate-400")} />
    <span className="font-medium text-sm truncate">{label}</span>
    {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
  </button>
);

const StatCard = ({ title, value, unit, trend, icon: Icon, color, prompt }: { title: string, value: string | number, unit?: string, trend?: string, icon: any, color: string, prompt?: string }) => (
  <div className="industrial-card p-5 flex flex-col gap-2 group relative">
    <div className="flex justify-between items-start">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", trend.startsWith('+') ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600")}>
          {trend}
        </span>
      )}
    </div>
    <div className="mt-2">
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {unit && <span className="text-slate-400 text-sm">{unit}</span>}
      </div>
    </div>
    {prompt && (
      <div className="absolute inset-0 bg-haiwei-blue/95 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col justify-center text-xs leading-relaxed z-10">
        <div className="flex items-center gap-2 mb-2 font-bold text-haiwei-green">
          <Cpu size={14} /> AI 智能助手
        </div>
        {prompt}
      </div>
    )}
  </div>
);

const AIPromptBox = ({ text }: { text: string }) => (
  <div className="bg-haiwei-blue/5 border-l-4 border-haiwei-blue p-4 rounded-r-xl mb-6">
    <div className="flex items-center gap-2 mb-2 text-haiwei-blue font-bold text-sm">
      <MessageSquare size={16} /> AI 系统提示
    </div>
    <p className="text-xs text-slate-600 leading-relaxed italic">"{text}"</p>
  </div>
);

// --- Views ---

const ProcurementView = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AIPromptBox text="请放置待检原料样本，系统将自动启动近红外光谱分析，实时显示蛋白质、脂肪、粗纤维、霉菌毒素等关键指标检测结果，并智能判定原料等级。" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="蛋白质含量" value="44.2" unit="%" trend="+0.5%" icon={Activity} color="bg-haiwei-blue" prompt="蛋白质指标稳定，符合一级豆粕标准。" />
        <StatCard title="霉菌毒素" value="未检出" icon={ShieldCheck} color="bg-haiwei-green" prompt="毒素检测合格，原料安全性极高。" />
        <StatCard title="采购建议价" value="3,450" unit="元/吨" trend="-20" icon={Scale} color="bg-haiwei-orange" prompt="建议采购区间：3420-3480元/吨，当前处于推荐区间。" />
        <StatCard title="供应商信用" value="98" unit="分" trend="+2" icon={Users} color="bg-haiwei-blue" prompt="该供应商交期准时率100%，质量合格率99.5%。" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="industrial-card p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-haiwei-blue" />
            原料成分智能分析 (NIR)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: '蛋白质', value: 44.2, target: 43.5 },
                { name: '脂肪', value: 1.8, target: 1.5 },
                { name: '粗纤维', value: 5.2, target: 6.0 },
                { name: '水分', value: 12.1, target: 13.0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="实测值" fill="#003366" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="标准值" fill="#66CC99" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="industrial-card p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Eye size={20} className="text-haiwei-orange" />
            AI 视觉掺假识别预警
          </h4>
          <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden mb-4">
            <img src="https://picsum.photos/seed/corn/800/450" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-rose-500 w-32 h-32 animate-pulse flex items-center justify-center">
                <span className="bg-rose-500 text-white text-[10px] px-2 py-1 absolute -top-6">疑似掺石粉</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <p className="text-xs text-white leading-relaxed">
                系统已启动AI视觉+成分双重检测模式，正在分析原料纹理、密度、颜色及成分比例...
              </p>
            </div>
          </div>
          <button className="w-full py-2 bg-rose-600 text-white text-sm font-bold rounded-lg">查看预警详情并复核</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="industrial-card p-6 lg:col-span-2">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Scale size={20} className="text-haiwei-blue" />
            采购定价AI建议
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { date: '03-13', price: 3480, suggest: 3460 },
                { date: '03-14', price: 3490, suggest: 3465 },
                { date: '03-15', price: 3475, suggest: 3460 },
                { date: '03-16', price: 3460, suggest: 3455 },
                { date: '03-17', price: 3465, suggest: 3450 },
                { date: '03-18', price: 3455, suggest: 3445 },
                { date: '03-19', price: 3450, suggest: 3440 },
              ]}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003366" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#003366" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#003366" fillOpacity={1} fill="url(#colorPrice)" />
                <Line type="monotone" dataKey="suggest" stroke="#66CC99" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            系统已整合当前期货价格、区域供需数据、原料检测等级及企业库存情况，为您生成最优采购定价区间。
          </p>
        </div>

        <div className="industrial-card p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users size={20} className="text-haiwei-blue" />
            供应商AI管理
          </h4>
          <div className="space-y-4">
            {[
              { name: '中粮贸易', rating: 5, status: '优质', color: 'text-emerald-600' },
              { name: '嘉吉投资', rating: 4.5, status: '推荐', color: 'text-blue-600' },
              { name: '某小型贸易商', rating: 2, status: '风险', color: 'text-rose-600' },
            ].map((s, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-haiwei-blue transition-colors cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">{s.name}</span>
                  <span className={cn("text-[10px] font-bold", s.color)}>{s.status}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={cn("text-xs", j < s.rating ? "text-amber-400" : "text-slate-300")}>★</span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">质量合格率: 99.8% · 交期准时率: 100%</p>
              </div>
            ))}
            <button className="w-full py-2 text-xs font-bold text-haiwei-blue bg-haiwei-blue/5 rounded-lg">查看详细信用报告</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductionView = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AIPromptBox text="系统正实时监控混合均匀度、制粒温湿度、颗粒硬度等关键生产指标，系统已自动调整设备参数至最佳状态。" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="混合均匀度" value="99.2" unit="%" trend="+0.2%" icon={Activity} color="bg-haiwei-blue" prompt="混合效果极佳，CV值控制在3%以内。" />
        <StatCard title="制粒温度" value="82.5" unit="°C" trend="+1.2" icon={Thermometer} color="bg-haiwei-orange" prompt="温度处于最佳熟化区间，颗粒硬度适中。" />
        <StatCard title="颗粒硬度" value="4.8" unit="kg/cm²" trend="+0.1" icon={Scale} color="bg-haiwei-blue" prompt="颗粒硬度符合标准，粉化率低于0.5%。" />
        <StatCard title="今日能耗" value="1,240" unit="kWh" trend="-8%" icon={Zap} color="bg-haiwei-green" prompt="节能方案已应用，预计今日节电120度。" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="industrial-card p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-haiwei-blue" />
            生产过程AI实时监控
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { time: '10:00', uniformity: 98.5, temp: 81.2, humidity: 12.5 },
                { time: '10:10', uniformity: 98.8, temp: 81.5, humidity: 12.6 },
                { time: '10:20', uniformity: 99.1, temp: 82.1, humidity: 12.8 },
                { time: '10:30', uniformity: 99.2, temp: 82.5, humidity: 13.0 },
                { time: '10:40', uniformity: 99.0, temp: 82.3, humidity: 12.9 },
                { time: '10:50', uniformity: 99.3, temp: 82.6, humidity: 13.1 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis yId="left" axisLine={false} tickLine={false} />
                <YAxis yId="right" orientation="right" axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line yId="left" type="monotone" dataKey="uniformity" name="均匀度(%)" stroke="#003366" strokeWidth={3} />
                <Line yId="right" type="monotone" dataKey="temp" name="温度(°C)" stroke="#FF6600" strokeWidth={2} />
                <Line yId="right" type="monotone" dataKey="humidity" name="湿度(%)" stroke="#66CC99" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="industrial-card p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-haiwei-green" />
            能耗AI管控与节能方案
          </h4>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center">
              <Droplets size={24} className="text-blue-500 mb-2" />
              <span className="text-xs text-slate-500">水耗</span>
              <span className="text-lg font-bold">45m³</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex flex-col items-center">
              <Zap size={24} className="text-amber-500 mb-2" />
              <span className="text-xs text-slate-500">电耗</span>
              <span className="text-lg font-bold">1.2k</span>
            </div>
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex flex-col items-center">
              <Flame size={24} className="text-rose-500 mb-2" />
              <span className="text-xs text-slate-500">气耗</span>
              <span className="text-lg font-bold">120m³</span>
            </div>
          </div>
          <div className="p-4 bg-haiwei-green/10 border border-haiwei-green/20 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-bold text-haiwei-green">AI 节能方案</h5>
              <span className="text-[10px] bg-haiwei-green text-white px-2 py-0.5 rounded">预计节能 8%</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">系统建议调整生产时段与设备运行模式，优化制粒机变频参数。</p>
            <button className="w-full py-2 bg-haiwei-green text-white text-xs font-bold rounded-lg">应用节能方案</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QualityView = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AIPromptBox text="请扫描产品包装上的溯源二维码，系统将展示该批次饲料从原料产地到物流配送的全链条信息。" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="质量合格率" value="99.5" unit="%" trend="+0.2%" icon={ShieldCheck} color="bg-haiwei-green" prompt="出厂检测指标全部优于国家标准。" />
        <StatCard title="溯源码生成" value="12,840" unit="件" trend="+12%" icon={PackageSearch} color="bg-haiwei-blue" prompt="每件产品拥有唯一数字化身份证。" />
        <StatCard title="待处理投诉" value="2" unit="单" trend="-1" icon={Bell} color="bg-haiwei-orange" prompt="AI已启动全维度追溯分析，正在定位问题环节。" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="industrial-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp size={20} className="text-haiwei-blue" />
                近7日质量合格率趋势
              </h4>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">平均合格率: 99.2%</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={QUALITY_DATA}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#66CC99" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#66CC99" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                  <YAxis domain={[95, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#66CC99" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="industrial-card p-6">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-haiwei-orange" />
              质量问题AI追溯与整改
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 mb-2">投诉/异常录入</p>
                  <textarea 
                    placeholder="输入客户投诉内容或生产异常描述..." 
                    className="w-full h-32 p-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-haiwei-blue resize-none"
                  />
                  <button className="w-full mt-2 py-2 bg-haiwei-blue text-white text-xs font-bold rounded-lg hover:bg-haiwei-blue/90 transition-colors">
                    AI 智能分析
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 p-4 rounded-xl bg-haiwei-blue/5 border border-haiwei-blue/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="text-sm font-bold text-haiwei-blue">AI 分析报告: 蛋白含量偏差</h5>
                    <p className="text-[10px] text-slate-500 mt-1">分析耗时: 1.2s · 匹配模型: Quality-V4 · 关联批次: HW-20240315-02</p>
                  </div>
                  <span className="px-2 py-1 bg-rose-100 text-rose-600 text-[10px] font-bold rounded">高风险</span>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-1 h-auto bg-haiwei-blue rounded-full" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">根本原因分析 (Root Cause)</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        检测到 03-15 批次原料豆粕蛋白含量波动(±1.5%)，系统自动识别出该波动未被实时补偿，联动生产线 #2 混合时间缩短 10s 导致均匀度不足。
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1 h-auto bg-haiwei-green rounded-full" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">整改建议 (AI Generated)</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        1. 增加原料入库近红外抽检频率；2. 调整混合机PLC参数补偿逻辑；3. 派单至生产部进行设备校准。
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">查看证据链</button>
                    <button className="px-4 py-1.5 text-xs font-bold bg-haiwei-blue text-white rounded-lg hover:bg-haiwei-blue/90 transition-colors shadow-sm">一键派单整改</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="industrial-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <QrCode size={20} className="text-haiwei-blue" />
                产品溯源管理
              </h4>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-haiwei-blue text-white text-[10px] font-bold rounded-lg hover:bg-haiwei-blue/90 transition-colors">
                  批量生成
                </button>
                <button className="text-xs text-haiwei-blue font-bold flex items-center gap-1">
                  <RefreshCw size={12} /> 刷新
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { id: 'HW-20240319-01', product: '高能肉鸡配合饲料', status: '已出厂', time: '2024-03-19 10:00' },
                { id: 'HW-20240319-02', product: '优质猪预混料', status: '生产中', time: '2024-03-19 11:30' },
                { id: 'HW-20240318-88', product: '水产膨化饲料', status: '已送达', time: '2024-03-18 15:20' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-haiwei-blue transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-haiwei-blue/5 transition-colors">
                      <PackageSearch size={20} className="text-slate-400 group-hover:text-haiwei-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.product}</p>
                      <p className="text-[10px] text-slate-500 font-mono">BATCH: {item.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      item.status === '已送达' ? "bg-emerald-100 text-emerald-600" : 
                      item.status === '生产中' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {item.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 py-3 text-sm font-bold text-haiwei-blue bg-haiwei-blue/5 hover:bg-haiwei-blue/10 rounded-xl transition-all border border-dashed border-haiwei-blue/30 flex items-center justify-center gap-2">
                <QrCode size={16} />
                生成新溯源码
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 italic text-center">
              系统已为每个批次生成唯一溯源二维码，支持全链条信息展示。
            </p>
          </div>

          <div className="industrial-card p-6">
            <h4 className="text-md font-bold mb-4">质量指标概览</h4>
            <div className="space-y-4">
              {[
                { label: '蛋白质含量', value: '98.5%', status: '正常' },
                { label: '水分含量', value: '12.2%', status: '正常' },
                { label: '霉菌毒素', value: '未检出', status: '安全' },
                { label: '颗粒硬度', value: '4.5kg', status: '正常' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{item.value}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-haiwei-green" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WarehouseView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <AIPromptBox text="系统已对接仓库温湿度、二氧化碳、光照传感器，系统已自动联动通风机、除湿机维持环境稳定。" />
    
    <div className="industrial-card p-6 bg-slate-900 text-white overflow-hidden relative min-h-[400px]">
      <div className="absolute top-6 left-6 z-10">
        <h4 className="text-xl font-bold flex items-center gap-2">
          <Warehouse size={24} className="text-haiwei-green" />
          仓库3D数字孪生地图
        </h4>
        <p className="text-slate-400 text-sm mt-1">实时监控 A-01 区域</p>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <div className="glass-panel bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-haiwei-green animate-pulse" />
          AI 环境调控: 运行中
        </div>
      </div>

      {/* Mock 3D Map Visualization */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <div className="grid grid-cols-4 gap-4 transform rotate-x-45 rotate-z-45 scale-150">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={cn(
              "w-20 h-20 border border-white/20 transition-all duration-500",
              i === 5 ? "bg-haiwei-orange/50 border-haiwei-orange" : "bg-white/5"
            )} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 md:grid-cols-4 gap-4 z-10">
        {[
          { label: '温度', value: '23.5', unit: '°C', status: '正常' },
          { label: '湿度', value: '42', unit: '%', status: '正常' },
          { label: 'CO₂浓度', value: '450', unit: 'ppm', status: '正常' },
          { label: '库存周转', value: '85', unit: '%', status: '高效' },
        ].map((item, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider">{item.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{item.value}</span>
              <span className="text-slate-500 text-xs">{item.unit}</span>
            </div>
            <span className="text-[10px] text-haiwei-green font-bold">{item.status}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="industrial-card p-6 lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-bold">库存智能预警与补货建议</h4>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-slate-100 rounded">临期提醒</button>
            <button className="px-3 py-1 text-xs bg-haiwei-blue text-white rounded">补货建议</button>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { name: '浓缩饲料 A', stock: 85, status: '紧急', color: 'text-rose-600', bg: 'bg-rose-50', expiry: '15天后过期' },
            { name: '配合饲料 B', stock: 42, status: '预警', color: 'text-amber-600', bg: 'bg-amber-50', expiry: '45天后过期' },
            { name: '预混料 C', stock: 120, status: '正常', color: 'text-emerald-600', bg: 'bg-emerald-50', expiry: '120天后过期' },
          ].map((item, i) => (
            <div key={i} className={cn("p-4 rounded-xl border border-slate-100 flex justify-between items-center", item.bg)}>
              <div>
                <p className="text-sm font-bold text-slate-800">{item.name}</p>
                <p className="text-[10px] text-slate-500">库存量: {item.stock}吨 · {item.expiry}</p>
              </div>
              <div className="text-right">
                <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase", item.color, "bg-white border border-current")}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-4 italic">
          系统已分析库存数据，发现3批浓缩饲料将于15天后过期，当前库存高于安全线20%，请及时调整库存结构。
        </p>
      </div>

      <div className="industrial-card p-6">
        <h4 className="text-lg font-bold mb-4">装卸AI行为监控</h4>
        <div className="space-y-4">
          {[
            { type: '野蛮搬运', time: '10:24:15', zone: 'A-02', img: 'https://picsum.photos/seed/safety/200/120' },
            { type: '抛掷行为', time: '09:45:12', zone: 'B-01', img: 'https://picsum.photos/seed/forklift/200/120' },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-rose-200">
                <img src={item.img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 border-2 border-rose-500 animate-pulse" />
                <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">{item.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500">{item.time} · {item.zone}</span>
                <button className="text-[10px] font-bold text-haiwei-blue">查看回放</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SalesView = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AIPromptBox text="系统已生成本月销售数据看板，华东区域销量环比增长15%，系统建议加大该地区水产饲料铺货力度。" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="industrial-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold">销售数据AI分析与预测</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveModal('export')}
                  className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  导出报告
                </button>
                <button 
                  onClick={() => setActiveModal('detail')}
                  className="px-3 py-1 text-xs font-medium bg-haiwei-blue text-white rounded-lg hover:bg-haiwei-blue/90 transition-colors"
                >
                  查看数据明细
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SALES_PREDICTION}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line type="monotone" dataKey="actual" name="实际销量" stroke="#003366" strokeWidth={3} dot={{ r: 4, fill: '#003366' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="predict" name="AI预测" stroke="#66CC99" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="industrial-card p-6">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Headset size={20} className="text-haiwei-blue" />
              AI 智能客服工作台
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 h-[400px] flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-haiwei-blue flex items-center justify-center text-white shrink-0">
                    <Cpu size={16} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 text-xs text-slate-700 shadow-sm max-w-[80%]">
                    您好！我是您的专属AI客服，支持文字、语音、图片咨询，请问您需要了解产品规格、营养指标、订货流程还是售后服务？
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <UserCircle size={16} />
                  </div>
                  <div className="bg-haiwei-blue p-3 rounded-2xl rounded-tr-none text-xs text-white shadow-sm max-w-[80%]">
                    我想查询一下订单 HW-20240319-01 的物流状态。
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-haiwei-blue flex items-center justify-center text-white shrink-0">
                    <Cpu size={16} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 text-xs text-slate-700 shadow-sm max-w-[80%]">
                    好的，正在为您查询... 该订单目前处于“已出厂”状态，预计明天下午送达。您可以点击下方按钮查看实时轨迹。
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <input type="text" placeholder="描述您的需求..." className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-haiwei-blue" />
                <button className="p-2 bg-haiwei-blue text-white rounded-lg">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="industrial-card p-6">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <UserCircle size={20} className="text-haiwei-blue" />
              客户智能管理
            </h4>
            <div className="space-y-4">
              {[
                { name: '希望牧业', type: '高价值', risk: '低', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { name: '大成农牧', type: '高价值', risk: '中', color: 'text-amber-600', bg: 'bg-amber-50' },
                { name: '某小型养殖场', type: '流失风险', risk: '高', color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((c, i) => (
                <div key={i} className={cn("p-3 rounded-xl border border-slate-100", c.bg)}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold">{c.name}</span>
                    <span className={cn("text-[10px] font-bold", c.color)}>{c.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">流失风险: {c.risk}</span>
                    <button className="text-[10px] font-bold text-haiwei-blue">维护策略</button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-4 italic">
              系统已完成客户分层分析，识别出15位高价值客户、8位流失风险客户。
            </p>
          </div>

          <div className="industrial-card p-6">
            <h4 className="text-md font-bold mb-4">区域销量分布</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '苏南', value: 45 },
                      { name: '苏中', value: 25 },
                      { name: '苏北', value: 30 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#003366" />
                    <Cell fill="#66CC99" />
                    <Cell fill="#FF6600" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Sales View */}
      <Modal isOpen={activeModal === 'export'} onClose={() => setActiveModal(null)} title="销售分析报告导出">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">请选择导出格式及包含内容：</p>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-slate-100 rounded-xl hover:border-haiwei-blue flex flex-col items-center gap-2 transition-all">
              <FileText size={32} className="text-blue-500" />
              <span className="text-sm font-bold">Word 格式</span>
            </button>
            <button className="p-4 border-2 border-slate-100 rounded-xl hover:border-haiwei-blue flex flex-col items-center gap-2 transition-all">
              <Monitor size={32} className="text-orange-500" />
              <span className="text-sm font-bold">PPT 演示文稿</span>
            </button>
          </div>
          <div className="p-4 bg-haiwei-blue/5 rounded-xl border border-haiwei-blue/10">
            <p className="text-xs font-bold text-haiwei-blue mb-2">AI 策略建议嵌入</p>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" defaultChecked className="rounded text-haiwei-blue" />
              自动包含针对苏北地区的促销策略建议
            </label>
          </div>
          <button className="w-full py-3 bg-haiwei-blue text-white font-bold rounded-xl">开始生成并下载</button>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'detail'} onClose={() => setActiveModal(null)} title="销售数据明细">
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['按区域', '按品类', '按客户', '复购率'].map(t => (
              <button key={t} className="px-3 py-1 text-xs bg-slate-100 rounded-full whitespace-nowrap">{t}</button>
            ))}
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-2">品类</th>
                <th className="p-2">销量(吨)</th>
                <th className="p-2">环比</th>
                <th className="p-2">复购率</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '肉鸡配合料', val: '1,240', trend: '+5.2%', rate: '88%' },
                { name: '优质猪预混料', val: '850', trend: '+2.1%', rate: '72%' },
                { name: '水产膨化料', val: '620', trend: '-1.5%', rate: '91%' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="p-2 font-bold">{row.name}</td>
                  <td className="p-2">{row.val}</td>
                  <td className={cn("p-2", row.trend.startsWith('+') ? "text-emerald-600" : "text-rose-600")}>{row.trend}</td>
                  <td className="p-2">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'recognition'} onClose={() => setActiveModal(null)} title="客户问题类型识别">
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-bold text-amber-800">AI 识别结果: 产品咨询 - 营养成分</p>
            <p className="text-[10px] text-amber-600 mt-1">置信度: 98.5%</p>
          </div>
          <p className="text-xs font-bold text-slate-500">匹配自动回复模板:</p>
          <div className="space-y-2">
            {[
              '您好，关于[产品名]的营养成分，我们的蛋白含量标准为...',
              '海维饲料均通过ISO9001认证，您可以点击此处查看检测报告...',
              '针对不同生长阶段，我们建议的喂养方案如下...'
            ].map((t, i) => (
              <button key={i} className="w-full text-left p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg hover:border-haiwei-blue transition-colors">
                {t}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'transfer'} onClose={() => setActiveModal(null)} title="智能客服转人工提示">
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 mb-2">客户历史对话摘要 (AI 生成)</p>
            <p className="text-xs text-slate-600 italic">
              "客户主要关注肉鸡饲料的蛋白含量稳定性，已询问过 03-15 批次的检测报告。AI 已提供基础数据，客户表现出进一步沟通意向。"
            </p>
          </div>
          <div className="flex items-center gap-4 p-3 bg-haiwei-blue/5 rounded-xl border border-haiwei-blue/10">
            <div className="w-12 h-12 rounded-full bg-slate-200" />
            <div>
              <p className="text-sm font-bold">在线人工客服: 王小美</p>
              <p className="text-xs text-slate-500">当前排队人数: 0</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-haiwei-blue text-white text-xs font-bold rounded-lg">立即接入</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'portrait'} onClose={() => setActiveModal(null)} title="客户画像详细侧边栏">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center">
              <UserCircle size={64} className="text-slate-300" />
            </div>
            <div className="text-center">
              <h5 className="font-bold">江苏某大型养殖场</h5>
              <p className="text-xs text-slate-500">合作时长: 5年</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">核心标签</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {['高复购', '价格敏感', '水产大户', '信用良好'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">购买偏好</p>
              <p className="text-xs text-slate-700 mt-1">主要采购: 膨化料 (60%), 预混料 (30%)</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">AI 建议</p>
              <p className="text-xs text-haiwei-green font-bold mt-1">推荐新品: 强化免疫系列</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const SecurityView = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="industrial-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Activity size={20} className="text-haiwei-blue" />
              硬件适配与数据传输
            </h4>
            <div className="flex gap-2">
              <button onClick={() => setActiveModal('troubleshoot')} className="px-3 py-1 text-xs bg-rose-50 text-rose-600 rounded-lg font-bold">故障排查</button>
              <button onClick={() => setActiveModal('acceptance')} className="px-3 py-1 text-xs bg-haiwei-blue text-white rounded-lg font-bold">验收报告</button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative p-4 bg-slate-900 rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center">
              {/* Mock Topology */}
              <div className="flex items-center gap-8 z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-haiwei-blue flex items-center justify-center border border-white/20">
                    <Cpu size={24} className="text-white" />
                  </div>
                  <span className="text-[10px] text-slate-400">传感器 A</span>
                </div>
                <div className="w-16 h-0.5 bg-haiwei-green relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                    <LayoutDashboard size={32} className="text-haiwei-green" />
                  </div>
                  <span className="text-[10px] text-white font-bold">AI 控制中心</span>
                </div>
                <div className="w-16 h-0.5 bg-haiwei-green" />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10">
                    <Lock size={24} className="text-slate-500" />
                  </div>
                  <span className="text-[10px] text-slate-400">云端存储</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-500 mb-1 uppercase">联调进度</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-haiwei-green" style={{ width: '85%' }} />
                  </div>
                  <span className="text-xs font-bold">85%</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-500 mb-1 uppercase">传输稳定性</p>
                <span className="text-xs font-bold text-emerald-600">99.98% (极佳)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="industrial-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Lock size={20} className="text-haiwei-orange" />
              数据安全态势感知
            </h4>
            <button onClick={() => setActiveModal('compliance')} className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg font-bold">合规报告</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-xl cursor-pointer" onClick={() => setActiveModal('alert')}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-600 rounded-lg">
                  <Bell size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-900">异常登录预警</p>
                  <p className="text-xs text-rose-600">检测到来自未知IP的访问尝试</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg">立即处理</button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">安全审计日志</p>
              {[
                { event: '管理员权限变更', user: 'IT_Admin', time: '10:45:20', status: '已审计' },
                { event: '敏感数据导出', user: 'Sales_Mgr', time: '09:30:15', status: '待审核' },
                { event: '模型参数更新', user: 'AI_System', time: '08:15:00', status: '自动通过' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 text-xs border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono">{log.time}</span>
                    <span className="font-bold text-slate-700">{log.event}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">{log.user}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold",
                      log.status === '待审核' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                    )}>{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="industrial-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-bold flex items-center gap-2">
            <Database size={20} className="text-haiwei-blue" />
            AI 模型迭代服务
          </h4>
          <button onClick={() => setActiveModal('newCategory')} className="px-3 py-1 text-xs bg-haiwei-blue text-white rounded-lg font-bold">接入新品类</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-2">模型性能看板</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs">准确率 (Accuracy)</span>
                <span className="text-xs font-bold text-haiwei-green">98.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">召回率 (Recall)</span>
                <span className="text-xs font-bold text-haiwei-blue">97.2%</span>
              </div>
              <button 
                onClick={() => setActiveModal('evaluation')}
                className="w-full mt-4 py-1.5 text-[10px] font-bold text-haiwei-blue border border-haiwei-blue/20 rounded"
              >
                查看评估详情 (ROC/混淆矩阵)
              </button>
            </div>
            <button className="w-full py-2 bg-haiwei-blue text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2">
              <RefreshCw size={14} /> 模型重新训练
            </button>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">迭代历史记录</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-medium">版本号</th>
                    <th className="pb-2 font-medium">更新内容</th>
                    <th className="pb-2 font-medium">性能提升</th>
                    <th className="pb-2 font-medium">操作人</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-50">
                    <td className="py-3 font-bold">V4.2.0</td>
                    <td className="py-3">优化肉鸡饲料配方预测模型</td>
                    <td className="py-3 text-haiwei-green">+1.5%</td>
                    <td className="py-3">AI_Engine</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="py-3 font-bold">V4.1.5</td>
                    <td className="py-3">新增水产类饲料溯源算法</td>
                    <td className="py-3 text-haiwei-green">+0.8%</td>
                    <td className="py-3">System</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Security View */}
      <Modal isOpen={activeModal === 'troubleshoot'} onClose={() => setActiveModal(null)} title="离线设备故障排查指南">
        <div className="space-y-4">
          <div className="flex gap-2">
            {['传感器', '监控摄像头', '网关设备', '控制终端'].map(t => (
              <button key={t} className="px-3 py-1 text-xs bg-slate-100 rounded-full">{t}</button>
            ))}
          </div>
          <div className="space-y-3">
            {[
              { q: '设备指示灯不亮', a: '检查电源适配器连接，确认插座是否有电。' },
              { q: '数据传输延迟高', a: '检查网络信号强度，尝试重启网关设备。' },
              { q: '传感器读数异常', a: '清理传感器表面灰尘，检查接口是否松动。' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <HelpCircle size={14} className="text-haiwei-blue" />
                  {item.q}
                </p>
                <p className="text-xs text-slate-600 mt-1 ml-5">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'acceptance'} onClose={() => setActiveModal(null)} title="硬件适配验收报告生成">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs font-bold text-emerald-800">联调结果: 通过</p>
              <p className="text-[10px] text-emerald-600">所有接口响应正常</p>
            </div>
            <div className="p-4 bg-haiwei-blue/5 border border-haiwei-blue/10 rounded-xl">
              <p className="text-xs font-bold text-haiwei-blue">数据稳定性: 99.9%</p>
              <p className="text-[10px] text-slate-500">测试时长: 72小时</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 mb-2">包含测试数据</p>
            <div className="space-y-1">
              {['延迟分布图', '丢包率统计', '并发压力测试', '异常恢复时间'].map(t => (
                <label key={t} className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded text-haiwei-blue" />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-haiwei-blue text-white font-bold rounded-xl">生成验收报告 (PDF)</button>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'evaluation'} onClose={() => setActiveModal(null)} title="模型性能评估详情">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase">混淆矩阵 (Confusion Matrix)</p>
              <div className="grid grid-cols-2 gap-1">
                <div className="aspect-square bg-haiwei-blue/80 text-white flex flex-col items-center justify-center rounded">
                  <span className="text-lg font-bold">942</span>
                  <span className="text-[8px]">TP</span>
                </div>
                <div className="aspect-square bg-slate-200 text-slate-500 flex flex-col items-center justify-center rounded">
                  <span className="text-lg font-bold">12</span>
                  <span className="text-[8px]">FP</span>
                </div>
                <div className="aspect-square bg-slate-200 text-slate-500 flex flex-col items-center justify-center rounded">
                  <span className="text-lg font-bold">8</span>
                  <span className="text-[8px]">FN</span>
                </div>
                <div className="aspect-square bg-haiwei-blue/60 text-white flex flex-col items-center justify-center rounded">
                  <span className="text-lg font-bold">890</span>
                  <span className="text-[8px]">TN</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase">ROC 曲线</p>
              <div className="aspect-square bg-slate-50 border border-slate-200 rounded flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 border-b border-l border-slate-300 m-4" />
                <svg className="w-full h-full p-4" viewBox="0 0 100 100">
                  <path d="M 0 100 Q 10 10, 100 0" fill="none" stroke="#66CC99" strokeWidth="2" />
                  <line x1="0" y1="100" x2="100" y2="0" stroke="#E2E8F0" strokeDasharray="2" />
                </svg>
                <span className="absolute bottom-6 right-6 text-[10px] font-bold text-haiwei-green">AUC: 0.98</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-haiwei-green/10 rounded-xl border border-haiwei-green/20">
            <p className="text-xs font-bold text-haiwei-green">效果提升数据</p>
            <p className="text-xs text-slate-700 mt-1">相比 V4.1 版本，推理速度提升 15%，长尾品类识别准确率提升 4.2%。</p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'newCategory'} onClose={() => setActiveModal(null)} title="新品类模型适配方案生成">
        <div className="space-y-4">
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-haiwei-blue transition-colors cursor-pointer">
            <Database size={32} className="text-slate-400" />
            <p className="text-xs font-bold text-slate-500">点击或拖拽上传新品类数据集 (.csv / .json)</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500">自动生成适配计划:</p>
            <div className="space-y-1">
              {[
                '1. 数据清洗与特征提取 (预计 2h)',
                '2. 迁移学习模型微调 (预计 6h)',
                '3. 模拟环境灰度测试 (预计 12h)',
                '4. 正式上线与监控'
              ].map((t, i) => (
                <p key={i} className="text-xs text-slate-600">{t}</p>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-haiwei-blue text-white font-bold rounded-xl">确认并开始适配</button>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'alert'} onClose={() => setActiveModal(null)} title="异常登录预警详情">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-xl">
            <AlertTriangle size={32} className="text-rose-600" />
            <div>
              <p className="text-sm font-bold text-rose-900">风险等级: 极高</p>
              <p className="text-xs text-rose-600">检测到暴力破解尝试</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">IP 地址:</span>
              <span className="font-bold">182.16.45.231 (江苏·南京)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">尝试时间:</span>
              <span className="font-bold">2024-03-19 10:42:15</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">尝试账号:</span>
              <span className="font-bold">admin_haiwei</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">忽略本次</button>
            <button className="py-2 bg-rose-600 text-white text-xs font-bold rounded-lg">立即封禁 IP</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'compliance'} onClose={() => setActiveModal(null)} title="数据安全合规报告生成">
        <div className="space-y-4">
          <p className="text-xs text-slate-600">报告将包含以下合规审计内容：</p>
          <div className="space-y-3">
            {[
              { label: '数据加密状态', desc: 'AES-256 存储加密与 TLS 1.3 传输加密' },
              { label: '权限管理审计', desc: '多角色访问控制 (RBAC) 完整性检查' },
              { label: '审计日志完整性', desc: '近 90 天所有敏感操作的可追溯性' },
              { label: '隐私保护合规', desc: '符合工业数据安全保护标准' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-800">{item.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-haiwei-blue text-white font-bold rounded-xl">生成合规报告 (Word)</button>
        </div>
      </Modal>
    </div>
  );
};

const TraceabilityView = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchBatch, setSearchBatch] = useState('HW-20240319-01');

  const timelineSteps = [
    {
      id: 'raw',
      title: '原料采集',
      time: '2024-03-15 08:30',
      desc: '进口大豆/玉米，海关检疫合格',
      status: 'completed',
      icon: Database,
      color: 'bg-haiwei-blue'
    },
    {
      id: 'production',
      title: '智能生产',
      time: '2024-03-17 14:20',
      desc: 'AI配方执行，混合均匀度99.2%',
      status: 'completed',
      icon: Cpu,
      color: 'bg-haiwei-green'
    },
    {
      id: 'warehouse',
      title: '仓储质检',
      time: '2024-03-18 09:00',
      desc: '入库环境监控正常，质检合格',
      status: 'completed',
      icon: Warehouse,
      color: 'bg-haiwei-blue'
    },
    {
      id: 'logistics',
      title: '物流配送',
      time: '2024-03-19 10:00',
      desc: '冷链运输中，预计今日送达',
      status: 'active',
      icon: Truck,
      color: 'bg-haiwei-orange'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Bar */}
      <div className="industrial-card p-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            placeholder="输入产品批次号进行全链路溯源..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-haiwei-blue"
          />
        </div>
        <button className="px-6 py-2 bg-haiwei-blue text-white font-bold rounded-xl text-sm shadow-lg shadow-haiwei-blue/20">
          立即溯源
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 industrial-card p-6">
          <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
            <Activity size={20} className="text-haiwei-blue" />
            全链路数字化溯源时轴
          </h4>
          <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {timelineSteps.map((step) => (
              <div key={step.id} className="relative flex gap-6 group">
                <div className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-transform group-hover:scale-110",
                  step.status === 'completed' ? step.color : "bg-slate-200"
                )}>
                  <step.icon size={18} className="text-white" />
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-haiwei-blue transition-all cursor-pointer" onClick={() => setActiveModal(step.id)}>
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-slate-800">{step.title}</h5>
                    <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                  </div>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      step.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600 animate-pulse"
                    )}>
                      {step.status === 'completed' ? '已完成' : '进行中'}
                    </span>
                    <button className="text-[10px] text-haiwei-blue font-bold ml-auto flex items-center gap-1">
                      查看详情 <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map & Blockchain */}
        <div className="space-y-6">
          <div className="industrial-card p-6 bg-slate-900 text-white overflow-hidden relative min-h-[300px]">
            <h4 className="text-md font-bold mb-4 relative z-10 flex items-center gap-2">
              <MapPin size={18} className="text-haiwei-orange" />
              批次流向地图可视化
            </h4>
            {/* Mock Map */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <path d="M 50 250 Q 150 50, 350 100" fill="none" stroke="#FF6600" strokeWidth="2" strokeDasharray="5 5" />
                <circle cx="50" cy="250" r="4" fill="#66CC99" />
                <circle cx="350" cy="100" r="4" fill="#FF6600" />
              </svg>
            </div>
            <div className="relative z-10 mt-32 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">当前位置:</span>
                <span className="font-bold">江苏·盐城 配送中心</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">下一站:</span>
                <span className="font-bold">山东·临沂 养殖基地</span>
              </div>
            </div>
          </div>

          <div className="industrial-card p-6 border-t-4 border-haiwei-blue">
            <h4 className="text-md font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-haiwei-blue" />
              区块链存证信息
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-[10px]">
                <p className="text-slate-400 mb-1">区块哈希 (Block Hash)</p>
                <p className="text-slate-700 break-all">0x7d2f...a9e3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-400 mb-1">存证时间</p>
                  <p className="text-xs font-bold">2024-03-19 10:05</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-400 mb-1">数字签名</p>
                  <p className="text-xs font-bold text-haiwei-green">已验证</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal('certificate')}
                className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
              >
                <FileCheck size={14} /> 查看溯源证书
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Traceability View */}
      <Modal isOpen={activeModal === 'raw'} onClose={() => setActiveModal(null)} title="原料采集详情">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase">原料名称</p>
              <p className="text-sm font-bold">进口非转基因大豆</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase">产地</p>
              <p className="text-sm font-bold">巴西 (Mato Grosso)</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-xs font-bold text-emerald-800 flex items-center gap-2">
              <ShieldCheck size={14} /> 海关检疫证明
            </p>
            <p className="text-[10px] text-emerald-600 mt-1">证书编号: CUST-20240215-9921, 检疫结果: 合格</p>
          </div>
          <img src="https://picsum.photos/seed/soybean/600/300" alt="raw material" className="w-full h-48 object-cover rounded-xl" referrerPolicy="no-referrer" />
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'production'} onClose={() => setActiveModal(null)} title="智能生产过程记录">
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-xl">
            <p className="text-xs font-bold text-haiwei-green mb-3 flex items-center gap-2">
              <Activity size={14} /> AI 配方执行监控
            </p>
            <div className="space-y-2">
              {[
                { label: '投料精度', val: '99.95%' },
                { label: '混合均匀度', val: '99.2%' },
                { label: '制粒温度', val: '82°C' },
                { label: '冷却水分', val: '12.5%' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-mono font-bold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 mb-2">生产线信息</p>
            <p className="text-xs text-slate-700">数字化车间 #2 生产线 - 班组: A班</p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'warehouse'} onClose={() => setActiveModal(null)} title="仓储环境监控">
        <div className="space-y-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WAREHOUSE_ENV}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Line type="monotone" dataKey="temp" name="温度" stroke="#FF6600" dot={false} />
                <Line type="monotone" dataKey="hum" name="湿度" stroke="#003366" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-400">库位编号</p>
              <p className="text-sm font-bold">A-01-204</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-400">入库质检</p>
              <p className="text-sm font-bold text-haiwei-green">合格 (QA-88)</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'logistics'} onClose={() => setActiveModal(null)} title="实时物流追踪">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-haiwei-blue/5 rounded-xl border border-haiwei-blue/10">
            <div className="w-12 h-12 rounded-full bg-haiwei-blue flex items-center justify-center text-white">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold">苏A·88921 (冷链运输车)</p>
              <p className="text-xs text-slate-500">司机: 李师傅 · 138****9921</p>
            </div>
          </div>
          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {[
              { time: '10:00', loc: '海维饲料厂', status: '已发货' },
              { time: '14:30', loc: '苏南中转站', status: '中转中' },
              { time: '18:00', loc: '目的地', status: '预计送达' },
            ].map((step, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-haiwei-blue" />
                <p className="text-xs font-bold text-slate-800">{step.loc}</p>
                <p className="text-[10px] text-slate-500">{step.time} · {step.status}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'certificate'} onClose={() => setActiveModal(null)} title="区块链溯源数字证书">
        <div className="p-8 bg-slate-50 rounded-2xl border-2 border-haiwei-blue/20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-haiwei-blue rounded-full flex items-center justify-center text-white mb-4 shadow-xl shadow-haiwei-blue/20">
            <ShieldCheck size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">产品数字化身份证</h3>
          <p className="text-sm text-slate-500 mt-2">批次号: {searchBatch}</p>
          <div className="w-full h-px bg-slate-200 my-6" />
          <div className="grid grid-cols-2 gap-8 w-full mb-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">认证机构</p>
              <p className="text-xs font-bold">海维质量安全中心</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">技术支持</p>
              <p className="text-xs font-bold">AntChain 区块链</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <QrCode size={120} className="text-slate-800" />
          </div>
          <p className="text-[10px] text-slate-400 mt-4">扫描二维码验证证书真伪</p>
        </div>
      </Modal>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('quality');
  const [role, setRole] = useState('管理层');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'procurement': return <ProcurementView />;
      case 'production': return <ProductionView />;
      case 'quality': return <QualityView />;
      case 'traceability': return <TraceabilityView />;
      case 'warehouse': return <WarehouseView />;
      case 'sales': return <SalesView />;
      case 'security': return <SecurityView />;
      default: return <QualityView />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'procurement': return '原料采购AI服务系统';
      case 'production': return '生产加工AI服务系统';
      case 'quality': return '产品质量AI服务系统';
      case 'traceability': return '全链路数字化溯源系统';
      case 'warehouse': return '仓储AI服务系统';
      case 'sales': return '销售与客户AI服务系统';
      case 'security': return '服务交付与数据安全保障';
      default: return '';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-haiwei-bg">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-white border-r border-slate-200 flex flex-col z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-haiwei-blue flex items-center justify-center text-white shadow-lg shadow-haiwei-blue/30 shrink-0">
            <Cpu size={24} />
          </div>
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="font-bold text-haiwei-blue leading-tight">海维AI大模型</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Industrial System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={ShoppingCart} label="原料采购管理" active={activeTab === 'procurement'} onClick={() => setActiveTab('procurement')} />
          <SidebarItem icon={Factory} label="生产加工管理" active={activeTab === 'production'} onClick={() => setActiveTab('production')} />
          <SidebarItem icon={ShieldCheck} label="产品质量管理" active={activeTab === 'quality'} onClick={() => setActiveTab('quality')} />
          <SidebarItem icon={PackageSearch} label="全链路溯源" active={activeTab === 'traceability'} onClick={() => setActiveTab('traceability')} />
          <SidebarItem icon={Warehouse} label="仓储AI监控" active={activeTab === 'warehouse'} onClick={() => setActiveTab('warehouse')} />
          <SidebarItem icon={TrendingUp} label="销售数据分析" active={activeTab === 'sales'} onClick={() => setActiveTab('sales')} />
          <SidebarItem icon={Lock} label="服务与安全" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          
          <div className="pt-6 pb-2 px-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">通用功能</p>
          </div>
          <SidebarItem icon={HelpCircle} label="帮助引导" active={activeTab === 'help'} onClick={() => {}} />
          <SidebarItem icon={MessageSquare} label="意见反馈" active={activeTab === 'feedback'} onClick={() => {}} />
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <UserCircle size={24} className="text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">张经理</p>
              <p className="text-[10px] text-slate-500">{role}</p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 truncate">{getTabTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="搜索功能或数据..." className="bg-transparent text-xs focus:outline-none w-48" />
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="text-xs font-bold bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer"
              >
                {['管理层', '生产主管', '仓储专员', '销售主管', 'IT运维'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              
              <button className="relative p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-haiwei-orange rounded-full border-2 border-white" />
              </button>
              
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer / Status Bar */}
        <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              系统状态: 正常
            </span>
            <span>服务器延迟: 24ms</span>
            <span>数据同步: 实时</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-haiwei-green" />
            安全合规等级: L3
          </div>
        </footer>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
