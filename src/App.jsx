import { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, Search, Terminal } from 'lucide-react';

const INITIAL_DATA = [
  {
    id: '1',
    target: 'Hackviser - SQLi Lab #1',
    vulnType: 'SQL Injection',
    severity: 'Kritik',
    status: 'Çözüldü',
    notes: "admin' OR 1=1-- payload'ı ile yönetim paneli girişi bypass edildi."
  },
  {
    id: '2',
    target: '192.168.1.45 - Web Sunucusu',
    vulnType: 'Reflected XSS',
    severity: 'Yüksek',
    status: 'Analiz Ediliyor',
    notes: 'Arama parametresinde girdi doğrulaması eksik, filtre atlatma deneniyor.'
  },
  {
    id: '3',
    target: 'OMÜ CTF - Ağ Trafiği Analizi',
    vulnType: 'Açık Port / Zayıf Servis',
    severity: 'Orta',
    status: 'Keşif',
    notes: 'Nmap taramasında 21 (FTP) ve 8080 portları açık tespit edildi.'
  }
];

const SEVERITY_COLORS = {
  'Düşük': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Orta': 'bg-amber-100 text-amber-800 border-amber-300',
  'Yüksek': 'bg-orange-100 text-orange-800 border-orange-300',
  'Kritik': 'bg-rose-200 text-rose-900 border-rose-400',
};

const COLUMNS = ['Keşif', 'Analiz Ediliyor', 'Çözüldü'];

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('ctf_tracker_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [target, setTarget] = useState('');
  const [vulnType, setVulnType] = useState('');
  const [severity, setSeverity] = useState('Orta');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('ctf_tracker_data', JSON.stringify(items));
  }, [items]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!target.trim() || !vulnType.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      target: target.trim(),
      vulnType: vulnType.trim(),
      severity,
      status: 'Keşif',
      notes: notes.trim() || 'Not eklenmedi.'
    };

    setItems([newItem, ...items]);
    setTarget('');
    setVulnType('');
    setSeverity('Orta');
    setNotes('');
  };

  const moveStatus = (id, direction) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const currentIndex = COLUMNS.indexOf(item.status);
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= COLUMNS.length) return item;
      return { ...item, status: COLUMNS[nextIndex] };
    }));
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item =>
    item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vulnType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: items.length,
    critical: items.filter(i => i.severity === 'Kritik' || i.severity === 'Yüksek').length,
    solved: items.filter(i => i.status === 'Çözüldü').length,
  };

  return (
    <div className="min-h-screen bg-[#261C38] text-[#261C38] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Üst Başlık ve İstatistik Kartları */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#433361] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#C7B3EA] border border-[#C6B2E6] rounded-xl shadow-md">
              <Terminal className="w-8 h-8 text-[#3A2B56]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#F3EDFC]">CTF & Zafiyet Takip Panosu</h1>
              <p className="text-sm text-[#CBBCE3]">Siber Güvenlik Analiz & Bulgu Yönetim Sistemi</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#C7B3EA] border border-[#C6B2E6] px-4 py-2.5 rounded-xl text-center shadow-md">
              <p className="text-xs font-medium text-[#4A386B]">Toplam Kayıt</p>
              <p className="text-xl font-bold text-[#261C38]">{stats.total}</p>
            </div>
            <div className="bg-[#C7B3EA] border border-[#C6B2E6] px-4 py-2.5 rounded-xl text-center shadow-md">
              <p className="text-xs font-medium text-[#4A386B]">Yüksek / Kritik</p>
              <p className="text-xl font-bold text-rose-700">{stats.critical}</p>
            </div>
            <div className="bg-[#C7B3EA] border border-[#C6B2E6] px-4 py-2.5 rounded-xl text-center shadow-md">
              <p className="text-xs font-medium text-[#4A386B]">Çözülen</p>
              <p className="text-xl font-bold text-emerald-700">{stats.solved}</p>
            </div>
          </div>
        </header>

        {/* Yeni Bulgu Ekleme Formu */}
        <form onSubmit={handleAdd} className="bg-[#C7B3EA] border border-[#C6B2E6] p-5 rounded-2xl space-y-4 shadow-lg">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#3A2B56] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#5D4587]" /> Yeni CTF Makinesi / Zafiyet Kaydı Ekle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Hedef / Makine Adı (Örn: Hackviser Lab)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-[#EFE8FA] border border-[#C6B2E6] text-[#261C38] placeholder-[#7A669E] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5D4587]"
              required
            />
            <input
              type="text"
              placeholder="Zafiyet Türü (Örn: XSS, SQLi, IDOR)"
              value={vulnType}
              onChange={(e) => setVulnType(e.target.value)}
              className="bg-[#EFE8FA] border border-[#C6B2E6] text-[#261C38] placeholder-[#7A669E] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5D4587]"
              required
            />
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="bg-[#EFE8FA] border border-[#C6B2E6] text-[#261C38] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5D4587]"
            >
              <option value="Düşük">Kritiklik: Düşük</option>
              <option value="Orta">Kritiklik: Orta</option>
              <option value="Yüksek">Kritiklik: Yüksek</option>
              <option value="Kritik">Kritiklik: Kritik</option>
            </select>
            <button
              type="submit"
              className="bg-[#4D3873] hover:bg-[#3D2B5E] text-[#F5EFFF] font-semibold rounded-xl px-5 py-2.5 text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Panoya Ekle
            </button>
          </div>
          <input
            type="text"
            placeholder="Teknik Not / Kullanılan Payload (İsteğe bağlı)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#EFE8FA] border border-[#C6B2E6] text-[#261C38] placeholder-[#7A669E] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5D4587]"
          />
        </form>

        {/* Arama Çubuğu */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6A558F] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Hedef makine veya zafiyet türüne göre filtrele..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#C7B3EA] border border-[#C6B2E6] text-[#261C38] placeholder-[#7A669E] rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#9E84C9] shadow-md"
          />
        </div>

        {/* 3 Sütunlu Kanban Panosu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => {
            const colItems = filteredItems.filter((item) => item.status === col);
            return (
              <div key={col} className="bg-[#C7B3EA] border border-[#C6B2E6] rounded-2xl p-4 flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#C6B2E6] pb-3">
                  <h3 className="font-bold text-[#261C38] flex items-center gap-2">
                    {col === 'Çözüldü' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <ShieldAlert className="w-4 h-4 text-[#4D3873]" />}
                    {col}
                  </h3>
                  <span className="text-xs font-semibold bg-[#C8B5E8] text-[#261C38] px-2.5 py-0.5 rounded-full">
                    {colItems.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[250px]">
                  {colItems.length === 0 && (
                    <p className="text-xs text-[#6A558F] text-center py-10">Bu aşamada kayıt bulunmuyor.</p>
                  )}
                  {colItems.map((item) => (
                    <div key={item.id} className="bg-[#EFE8FA] border border-[#C6B2E6] hover:border-[#7B61AB] p-4 rounded-xl space-y-3 transition shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${SEVERITY_COLORS[item.severity]}`}>
                            {item.severity}
                          </span>
                          <h4 className="font-bold text-[#261C38] mt-2">{item.target}</h4>
                          <p className="text-xs text-[#5D4587] font-semibold font-mono mt-0.5">{item.vulnType}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Kaydı Sil"
                          className="text-[#7A669E] hover:text-rose-700 transition p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-[#3A2B56] bg-[#E3D7F5] p-2.5 rounded-lg border border-[#C6B2E6] font-mono">
                        {item.notes}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => moveStatus(item.id, -1)}
                          disabled={col === 'Keşif'}
                          className="text-xs font-medium flex items-center gap-1 text-[#5D4587] hover:text-[#261C38] disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Geri
                        </button>
                        <button
                          onClick={() => moveStatus(item.id, 1)}
                          disabled={col === 'Çözüldü'}
                          className="text-xs font-semibold flex items-center gap-1 text-[#4D3873] hover:text-[#261C38] disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                        >
                          İleri <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}