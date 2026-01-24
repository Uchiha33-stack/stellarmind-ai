import { useState } from "react";
import { StickyNote, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface NoteItem {
  id: string;
  content: string;
  timestamp: number;
}

interface NotesPanelProps {
  notes: NoteItem[];
  onAdd: (content: string) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const NotesPanel = ({ notes, onAdd, onUpdate, onDelete }: NotesPanelProps) => {
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAdd = () => {
    if (newNote.trim()) {
      onAdd(newNote.trim());
      setNewNote("");
    }
  };

  const handleStartEdit = (note: NoteItem) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editContent.trim()) {
      onUpdate(editingId, editContent.trim());
      setEditingId(null);
      setEditContent("");
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <StickyNote className="w-5 h-5 text-space-nebula" />
        <h2 className="font-display text-lg font-semibold">Notes</h2>
      </div>

      {/* New note input */}
      <div className="mb-4 p-3 rounded-xl bg-card/50 border border-border/50">
        <Textarea
          placeholder="Write a note... 📝"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[80px] bg-transparent border-0 resize-none focus-visible:ring-0 p-0 text-sm placeholder:text-muted-foreground/50"
        />
        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!newNote.trim()}
            className="bg-space-nebula/20 text-space-nebula hover:bg-space-nebula/30 border border-space-nebula/30"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-2">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <StickyNote className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs mt-1">Jot down your cosmic thoughts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className={cn(
                  "group p-3 rounded-xl bg-gradient-to-br from-space-nebula/5 to-space-stellar/5 border border-space-nebula/20",
                  "hover:border-space-nebula/40 transition-all duration-300"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {editingId === note.id ? (
                  <div>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[60px] bg-transparent border-0 resize-none focus-visible:ring-0 p-0 text-sm"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="text-xs bg-space-nebula/20 text-space-nebula hover:bg-space-nebula/30"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p
                      className="text-sm text-foreground whitespace-pre-wrap cursor-pointer"
                      onClick={() => handleStartEdit(note)}
                    >
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onDelete(note.id)}
                      >
                        <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotesPanel;
