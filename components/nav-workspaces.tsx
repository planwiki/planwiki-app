"use client";

import { IconTrash } from "@tabler/icons-react";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function NavChats() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const currentChatId = params.id as string;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const { data: chats, isLoading } = trpc.chat.getChats.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
  });
  const utils = trpc.useUtils();
  const deleteChat = trpc.chat.deleteChat.useMutation({
    onSuccess: () => {
      // Invalidate chat list to refresh
      utils.chat.getChats.invalidate();
      toast.success("Chat deleted successfully");

      router.replace("/chat");
    },
    onError: (error) => {
      toast.error("Failed to delete chat", {
        description: error.message,
      });
    },
  });

  const renameChat = trpc.chat.updateChatTitle.useMutation({
    onSuccess: () => {
      utils.chat.getChats.invalidate();
      toast.success("Chat renamed successfully");
    },
    onError: (error) => {
      toast.error("Failed to rename chat", {
        description: error.message,
      });
    },
  });

  const handleDeleteClick = (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      deleteChat.mutate({ chatId: chatToDelete });
    }
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const handleRenameClick = (
    chatId: string,
    currentTitle: string,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToRename(chatId);
    setNewTitle(currentTitle);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (chatToRename && newTitle.trim()) {
      renameChat.mutate({ chatId: chatToRename, title: newTitle.trim() });
    }
    setRenameDialogOpen(false);
    setChatToRename(null);
    setNewTitle("");
  };

  const handleRenameCancel = () => {
    setRenameDialogOpen(false);
    setChatToRename(null);
    setNewTitle("");
  };

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone and will delete all messages in this conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Assessment</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new title for this assessment project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Assessment title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameConfirm();
                }
              }}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleRenameCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRenameConfirm}
              disabled={!newTitle.trim()}
            >
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SidebarGroup>
        <SidebarGroupLabel>Recents</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Project List */}
            {isLoading
              ? Array.from({ length: 7 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton className="pointer-events-none h-8">
                      <Skeleton
                        height="100%"
                        width="100%"
                        containerClassName="flex-1 h-4"
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              : chats?.map((chat) => {
                  const isActive = currentChatId === chat.id;
                  return (
                    <SidebarMenuItem key={chat.id} className="group/item">
                      <div className="flex items-center w-full gap-1">
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={chat.title}
                          className={isMobile ? "flex-1 min-h-11" : "flex-1"}
                        >
                          <Link href={`/chat/${chat.id}`}>
                            <span className="group-data-[collapsible=icon]:hidden truncate">
                              {chat.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className={
                            isMobile
                              ? "opacity-100 h-8 w-8 shrink-0 group-data-[collapsible=icon]:hidden"
                              : "opacity-0 group-hover/item:opacity-100 transition-opacity h-7 w-7 shrink-0 group-data-[collapsible=icon]:hidden"
                          }
                          onClick={(e) =>
                            handleRenameClick(chat.id, chat.title, e)
                          }
                        >
                          <Edit2 className={isMobile ? "h-4 w-4" : "h-4 w-4"} />
                          <span className="sr-only">Rename assessment</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className={
                            isMobile
                              ? "opacity-100 h-8 w-8 shrink-0 group-data-[collapsible=icon]:hidden"
                              : "opacity-0 group-hover/item:opacity-100 transition-opacity h-7 w-7 shrink-0 group-data-[collapsible=icon]:hidden"
                          }
                          onClick={(e) => handleDeleteClick(chat.id, e)}
                        >
                          <IconTrash
                            className={isMobile ? "h-4 w-4" : "h-4 w-4"}
                          />
                          <span className="sr-only">Delete assessment</span>
                        </Button>
                      </div>
                    </SidebarMenuItem>
                  );
                })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
