import React, { useState } from 'react';
import { 
  BookOpen, 
  Lock, 
  Sparkles, 
  Search, 
  Tag, 
  Plus, 
  CheckCircle, 
  Trash2, 
  ShieldCheck, 
  Star, 
  Edit3, 
  Copy, 
  Check, 
  Filter, 
  Calendar, 
  Clock, 
  FileText,
  X
} from 'lucide-react';

export default function JournalView({ 
  entries = [], 
  onAddEntry, 
  onUpdateEntry, 
  onDeleteEntry, 
  onToggleFavorite 
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Gratitude');
  const [associatedMood, setAssociatedMood] = useState('Peaceful');
  const [editingId, setEditingId] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'length'

  const [activePrompt, setActivePrompt] = useState('What made you smile or feel deeply peaceful today?');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [activeReadingEntry, setActiveReadingEntry] = useState(null);

  const categories = [
    'Gratitude', 
    'Self-Growth', 
    'Anxiety Release', 
    'Daily Wins', 
    'Therapy Reflections', 
    'Deep Thoughts'
  ];

  const prompts = [
    'What made you smile or feel deeply peaceful today?',
    'What is one heavy thought you can safely let go of right now?',
    'What are 3 small things you are genuinely grateful for today?',
    'Describe a moment today where you felt proud of your emotional growth.',
    'If your anxiety could speak, what gentle reassurance would you offer it?',
    'Who is someone that showed you kindness lately, and how did it impact you?',
    'What boundary can you set this week to protect your mental energy?'
  ];

  const handleRandomPrompt = () => {
    const nextPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setActivePrompt(nextPrompt);
  };

  const handleStartEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setCategory(entry.category || 'Gratitude');
    setAssociatedMood(entry.associatedMood || 'Peaceful');
    if (entry.promptUsed) setActivePrompt(entry.promptUsed);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('Gratitude');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const wordCount = content.trim().split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 120))} min read`;

    if (editingId) {
      if (onUpdateEntry) {
        onUpdateEntry(editingId, {
          title: title.trim(),
          content: content.trim(),
          category,
          associatedMood,
          promptUsed: activePrompt,
          wordCount,
          readTime
        });
      }
      setToastMessage('Reflection updated successfully!');
      setEditingId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        category,
        associatedMood,
        promptUsed: activePrompt,
        wordCount,
        readTime,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        fullDate: new Date().toISOString(),
        isFavorite: false
      };

      if (onAddEntry) {
        onAddEntry(newEntry);
      }
      setToastMessage('Reflection saved to private vault!');
    }

    setTitle('');
    setContent('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (entry) => {
    const text = `Mindful Reflection: ${entry.title}\nDate: ${entry.date}\nCategory: ${entry.category}\n\n${entry.content}`;
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter & Search Logic
  const filteredEntries = entries
    .filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.category && e.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.promptUsed && e.promptUsed.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter;

      const matchesFav = !showOnlyFavorites || e.isFavorite;

      return matchesSearch && matchesCategory && matchesFav;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
      if (sortBy === 'oldest') return (a.id || 0) - (b.id || 0);
      if (sortBy === 'length') return (b.content?.length || 0) - (a.content?.length || 0);
      return 0;
    });

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-10 pb-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 text-mindful-purple text-xs font-bold border border-purple-100">
          <ShieldCheck className="w-4 h-4 text-mindful-purple" />
          <span>Encrypted Private Vault & Reflection Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-mindful-textDark">
          Personal Journal & Diary
        </h1>
        <p className="text-sm text-mindful-textMuted leading-relaxed">
          Express your inner thoughts freely in a safe, confidential digital sanctuary designed for clarity, gratitude, and emotional healing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Write / Edit Entry Column */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-mindful-textDark flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-mindful-purple" />
              {editingId ? 'Edit Reflection' : 'New Journal Entry'}
            </h2>

            <button
              type="button"
              onClick={handleRandomPrompt}
              className="px-3.5 py-1.5 rounded-full bg-mindful-purple-subtle/60 text-mindful-purple text-xs font-bold hover:bg-mindful-purple-subtle transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspire New Prompt</span>
            </button>
          </div>

          {/* Prompt Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-peach-50/20 to-orange-50 border border-purple-100/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-mindful-purple">Mindful Journaling Prompt</span>
            <p className="text-xs font-semibold text-mindful-textDark italic">
              "{activePrompt}"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-mindful-textMuted mb-1">Entry Title</label>
              <input
                type="text"
                required
                placeholder="Give your thoughts a meaningful title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-mindful-bg text-sm text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-mindful-textMuted mb-1">Category / Purpose</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-mindful-textMuted mb-1">Emotional State While Writing</label>
                <select
                  value={associatedMood}
                  onChange={(e) => setAssociatedMood(e.target.value)}
                  className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
                >
                  <option value="Peaceful">Peaceful 🌿</option>
                  <option value="Grateful">Grateful 🙏</option>
                  <option value="Inspired">Inspired ✨</option>
                  <option value="Reflective">Reflective 🌙</option>
                  <option value="Anxious">Anxious (Processing) 💭</option>
                  <option value="Relieved">Relieved 🍃</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-mindful-textMuted">Reflection Content</label>
                <span className="text-[11px] text-mindful-textMuted font-medium">
                  {words} words • ~{Math.max(1, Math.ceil(words / 120))} min read
                </span>
              </div>
              <textarea
                required
                rows={9}
                placeholder="Pour your heart and thoughts out here freely. This space is entirely yours and encrypted..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-mindful-bg text-sm text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2">
              {toastMessage ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle className="w-4 h-4" />
                  {toastMessage}
                </span>
              ) : (
                <span className="text-xs text-mindful-textMuted flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> 100% Client-side confidential
                </span>
              )}

              <div className="flex items-center gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-full border border-gray-200 text-mindful-textMuted hover:text-mindful-textDark text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all flex items-center gap-1.5 transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingId ? 'Update Reflection' : 'Save Reflection'}</span>
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* Past Entries & Management Column */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-mindful-textDark">Past Reflections</h2>
                <p className="text-xs text-mindful-textMuted">{filteredEntries.length} entries found</p>
              </div>

              {/* Starred filter button */}
              <button
                type="button"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  showOnlyFavorites
                    ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-xs'
                    : 'bg-mindful-bg text-mindful-textMuted border-gray-200 hover:text-mindful-textDark'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>Favorites</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-mindful-textMuted absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by keywords, title, prompt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-mindful-bg text-xs text-mindful-textDark rounded-full border border-gray-200 focus:outline-none focus:border-mindful-purple"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-mindful-purple text-white shadow-xs'
                      : 'bg-mindful-bg text-mindful-textMuted hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center justify-between text-[11px] text-mindful-textMuted pt-1 border-t border-gray-100">
              <span className="font-semibold">Sort entries:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`font-bold ${sortBy === 'newest' ? 'text-mindful-purple underline' : 'hover:text-mindful-textDark'}`}
                >
                  Newest
                </button>
                <span>•</span>
                <button
                  onClick={() => setSortBy('oldest')}
                  className={`font-bold ${sortBy === 'oldest' ? 'text-mindful-purple underline' : 'hover:text-mindful-textDark'}`}
                >
                  Oldest
                </button>
                <span>•</span>
                <button
                  onClick={() => setSortBy('length')}
                  className={`font-bold ${sortBy === 'length' ? 'text-mindful-purple underline' : 'hover:text-mindful-textDark'}`}
                >
                  Longest
                </button>
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1 flex-1">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <BookOpen className="w-8 h-8 text-mindful-textMuted mx-auto opacity-50" />
                <p className="text-xs text-mindful-textMuted">No reflections match your search or filter.</p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-5 rounded-2xl bg-mindful-bg border border-gray-100 space-y-2.5 hover:border-mindful-purple-subtle transition-all relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-mindful-purple uppercase tracking-wider bg-purple-100 px-2.5 py-0.5 rounded-md">
                        {entry.category}
                      </span>
                      {entry.associatedMood && (
                        <span className="text-[10px] font-bold text-mindful-peach bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                          {entry.associatedMood}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite && onToggleFavorite(entry.id)}
                        className="text-gray-400 hover:text-amber-500 transition-colors p-1"
                        title="Star entry"
                      >
                        <Star className={`w-3.5 h-3.5 ${entry.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(entry)}
                        className="text-gray-400 hover:text-mindful-purple transition-colors p-1"
                        title="Copy to clipboard"
                      >
                        {copiedId === entry.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(entry)}
                        className="text-gray-400 hover:text-mindful-purple transition-colors p-1"
                        title="Edit reflection"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteEntry && onDeleteEntry(entry.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete reflection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 
                      onClick={() => setActiveReadingEntry(entry)}
                      className="text-sm font-bold text-mindful-textDark cursor-pointer hover:text-mindful-purple transition-colors flex items-center justify-between"
                    >
                      <span>{entry.title}</span>
                    </h3>
                    <p className="text-xs text-mindful-textMuted line-clamp-3 leading-relaxed mt-1">
                      {entry.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-mindful-textMuted pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </span>
                    <span>{entry.readTime || '1 min read'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Reading Modal */}
      {activeReadingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mindful-textDark/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-xl w-full rounded-3xl p-8 border border-mindful-purple-subtle shadow-floating space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveReadingEntry(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-mindful-bg hover:bg-gray-200 text-mindful-textDark flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-mindful-purple uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
                  {activeReadingEntry.category}
                </span>
                <span className="text-xs text-mindful-textMuted">{activeReadingEntry.date}</span>
              </div>
              <h2 className="text-2xl font-bold text-mindful-textDark">{activeReadingEntry.title}</h2>
              {activeReadingEntry.promptUsed && (
                <p className="text-xs text-mindful-textMuted italic bg-mindful-bg p-2.5 rounded-xl border border-gray-100">
                  Prompt: "{activeReadingEntry.promptUsed}"
                </p>
              )}
            </div>

            <div className="text-sm text-mindful-textDark leading-relaxed whitespace-pre-line">
              {activeReadingEntry.content}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-mindful-textMuted">
              <span>{activeReadingEntry.readTime}</span>
              <button
                onClick={() => {
                  handleCopy(activeReadingEntry);
                }}
                className="px-4 py-2 rounded-full bg-mindful-bg hover:bg-mindful-purple-subtle text-mindful-textDark font-bold transition-all flex items-center gap-1.5"
              >
                {copiedId === activeReadingEntry.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Text
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
