import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/animate-ui/radix/tabs";
import { AvailableTeamsPanel } from "@/components/PickListComponents/AvailableTeamsPanel";
import { CreatePickList } from "@/components/PickListComponents/CreatePickList";
import { PickListCard } from "@/components/PickListComponents/PickListCard";
import { AllianceSelectionTable } from "@/components/PickListComponents/AllianceSelectionTable";
import type { TeamStats, PickList, PickListItem, SortOption } from "@/lib/pickListTypes";
import type { Alliance, BackupTeam } from "@/lib/allianceTypes";

interface MobilePickListLayoutProps {
  activeTab: string;
  showAllianceSelection: boolean;
  filteredAndSortedTeams: TeamStats[];
  pickLists: PickList[];
  alliances: Alliance[];
  backups: BackupTeam[];
  availableTeams: TeamStats[];
  newListName: string;
  newListDescription: string;
  searchFilter: string;
  sortBy: SortOption;
  canDeleteAll?: boolean;
  onTabChange: (tab: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortOption) => void;
  onAddTeamToList: (team: TeamStats, listId: number) => void;
  onAddTeamToAlliance?: (teamNumber: string, allianceId: number) => void;
  onUpdateAlliances: (alliances: Alliance[]) => void;
  onUpdateBackups: (backups: BackupTeam[]) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onCreateList: () => void;
  onDeleteList: (listId: number) => void;
  onUpdateTeams: (listId: number, newTeams: PickListItem[]) => void;
  onAssignToAlliance: (teamNumber: string, allianceIndex: number) => void;
}

export const MobilePickListLayout = ({
  activeTab,
  showAllianceSelection,
  filteredAndSortedTeams,
  pickLists,
  alliances,
  backups,
  availableTeams,
  newListName,
  newListDescription,
  searchFilter,
  sortBy,
  canDeleteAll = true,
  onTabChange,
  onSearchChange,
  onSortChange,
  onAddTeamToList,
  onAddTeamToAlliance,
  onUpdateAlliances,
  onUpdateBackups,
  onNameChange,
  onDescriptionChange,
  onCreateList,
  onDeleteList,
  onUpdateTeams,
  onAssignToAlliance
}: MobilePickListLayoutProps) => {
  return (
    <div className="xl:hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full" enableSwipe={true}>
        <TabsList className={`grid w-full ${showAllianceSelection ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="teams">Available Teams</TabsTrigger>
          {showAllianceSelection && <TabsTrigger value="alliances">Alliances</TabsTrigger>}
          <TabsTrigger value="lists">Pick Lists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams" className="mt-6">
          <AvailableTeamsPanel
            teams={filteredAndSortedTeams}
            pickLists={pickLists}
            alliances={alliances}
            searchFilter={searchFilter}
            sortBy={sortBy}
            onSearchChange={onSearchChange}
            onSortChange={onSortChange}
            onAddTeamToList={onAddTeamToList}
            onAddTeamToAlliance={onAddTeamToAlliance}
          />
        </TabsContent>
        
        {showAllianceSelection && (
          <TabsContent value="alliances" className="mt-6">
            <AllianceSelectionTable
              alliances={alliances}
              backups={backups}
              availableTeams={availableTeams}
              onUpdateAlliances={onUpdateAlliances}
              onUpdateBackups={onUpdateBackups}
            />
          </TabsContent>
        )}
        
        <TabsContent value="lists" className="mt-6 space-y-6">
          {/* Create New List */}
          <CreatePickList
            newListName={newListName}
            newListDescription={newListDescription}
            onNameChange={onNameChange}
            onDescriptionChange={onDescriptionChange}
            onCreateList={onCreateList}
          />

          {/* Pick Lists or Empty State */}
          {pickLists.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-muted-foreground mb-4">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Pick Lists</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first pick list to start organizing teams for alliance selection.
              </p>
              <p className="text-xs text-muted-foreground">
                You can also import existing pick lists using the Import button above.
              </p>
            </div>
          ) : (
            pickLists.map(list => (
              <PickListCard
                key={list.id}
                pickList={list}
                availableTeams={availableTeams}
                alliances={alliances}
                canDelete={canDeleteAll}
                onDeleteList={onDeleteList}
                onUpdateTeams={onUpdateTeams}
                onAssignToAlliance={onAssignToAlliance}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
