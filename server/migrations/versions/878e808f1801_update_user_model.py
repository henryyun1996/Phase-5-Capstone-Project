"""Update user model

Revision ID: 878e808f1801
Revises: f1446f66011d
Create Date: 2023-04-26 15:58:22.405237

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '878e808f1801'
down_revision = 'f1446f66011d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('event_planning_rooms', schema=None) as batch_op:
        batch_op.drop_column('time_of_event')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('event_planning_rooms', schema=None) as batch_op:
        batch_op.add_column(sa.Column('time_of_event', sa.DATETIME(), nullable=True))

    # ### end Alembic commands ###